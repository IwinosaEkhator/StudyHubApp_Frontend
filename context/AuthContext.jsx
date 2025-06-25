import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create the AuthContext for global auth & profile-complete state
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);

  // NEW: track if the user completed topics-step
  const [profileComplete, setProfileCompleteState] = useState(false);

  // Axios instance
  const api = axios.create({
    baseURL: 'http://192.168.67.136:8000/api',
    timeout: 30000,
  });
  const setAuthHeader = (token) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  // Load persisted auth & profile-complete on mount
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('accessToken');
        const storedUser = await AsyncStorage.getItem('user');
        const storedComplete = await AsyncStorage.getItem('profileComplete');

        if (storedToken && storedUser) {
          setAccessToken(storedToken);
          setUser(JSON.parse(storedUser));
          setAuthHeader(storedToken);
        }
        if (storedComplete === 'true') {
          setProfileCompleteState(true);
        }
      } catch (error) {
        console.error('Failed to load auth state', error);
      } finally {
        setAuthLoaded(true);
      }
    };
    loadAuthState();
  }, []);

  // Persist auth state helper
  const persistAuthState = async (token, userData) => {
    try {
      await AsyncStorage.setItem('accessToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to persist auth state', error);
    }
  };

  // Persist profile-complete flag
  const setProfileComplete = async (flag) => {
    try {
      await AsyncStorage.setItem('profileComplete', flag ? 'true' : 'false');
      setProfileCompleteState(flag);
    } catch (error) {
      console.error('Failed to persist profileComplete', error);
    }
  };

  /**
   * Register a new user.
   */
  const register = async (username, email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/signup', { username, email, password });
      const { token, user: userData } = response.data;
      setAccessToken(token);
      setUser(userData);
      setAuthHeader(token);
      await persistAuthState(token, userData);
      // leave profileComplete=false so TopicsScreen shows
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      let errorMessage = 'An error occurred during registration.';
      if (error.response?.data?.error) {
        const err = error.response.data.error;
        errorMessage = typeof err === 'string'
          ? err
          : Object.values(err).flat().join('\n');
      }
      Alert.alert('Registration Error', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login an existing user.
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/signin', { email, password });
      const { token, user: userData } = response.data;
      setAccessToken(token);
      setUser(userData);
      setAuthHeader(token);
      await persistAuthState(token, userData);
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      let errorMessage = 'An error occurred during login.';
      if (error.response?.data?.error) {
        const err = error.response.data.error;
        errorMessage = typeof err === 'string'
          ? err
          : Object.values(err).flat().join('\n');
      }
      Alert.alert('Login Error', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout the current user.
   */
  const logout = async () => {
    try {
      if (accessToken) {
        await api.post('/signout', null, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error('Logout error:', error.response?.data || error.message);
        Alert.alert('Logout Error', 'An error occurred while logging out.');
      }
    } finally {
      setAccessToken(null);
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
      await AsyncStorage.multiRemove(['accessToken', 'user', 'profileComplete']);
      setProfileCompleteState(false);
    }
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        authLoaded,
        profileComplete,
        setProfileComplete,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
