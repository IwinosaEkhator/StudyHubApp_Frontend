import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create the AuthContext for global auth state
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(false);

  // NEW: Flag to indicate auth state has been loaded from AsyncStorage
  const [authLoaded, setAuthLoaded] = useState(false);

  // Create an Axios instance with the base URL of your backend API
  const api = axios.create({
    baseURL: 'http://192.168.115.136:8000/api', // Replace with your backend URL
    timeout: 30000, // Increase timeout to 30 seconds
  });

  // Helper function to set Authorization header when token is available
  const setAuthHeader = (token) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  // Load persisted auth state on mount
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('accessToken');
        const storedUser = await AsyncStorage.getItem('user');
        if (storedToken && storedUser) {
          setAccessToken(storedToken);
          setUser(JSON.parse(storedUser));
          setAuthHeader(storedToken);
        }
      } catch (error) {
        console.error('Failed to load auth state', error);
      } finally {
        setAuthLoaded(true);  // Set flag after attempting to load auth state
      }
    };

    loadAuthState();
  }, []);

  // Helper to persist auth state
  const persistAuthState = async (token, userData) => {
    try {
      if (token && userData) {
        await AsyncStorage.setItem('accessToken', token);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      } else {
        console.warn('Invalid token or user data; skipping persistence');
      }
    } catch (error) {
      console.error('Failed to persist auth state', error);
    }
  };
  

  /**
   * Register a new user.
   */
  const register = async (username, email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/signup', {
        email,
        username,
        password,
      });
      console.log("Register response:", response.data); // Debug log
      setAccessToken(response.data.token);
      setUser(response.data.user);
      setAuthHeader(response.data.token);
      // Persist the auth state so that login persists even after app restart
      await persistAuthState(response.data.token, response.data.user);
      return response.data; // Return data on success
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      let errorMessage = 'An error occurred during registration.';
      if (error.response?.data?.error) {
        if (typeof error.response.data.error === 'string') {
          errorMessage = error.response.data.error;
        } else if (typeof error.response.data.error === 'object') {
          errorMessage = Object.values(error.response.data.error).flat().join('\n');
        }
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
      setAccessToken(response.data.token);
      setUser(response.data.user);
      setAuthHeader(response.data.token);
      // Persist the auth state
      await persistAuthState(response.data.token, response.data.user);
      return response.data; // Return data on success
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      let errorMessage = 'An error occurred during login.';
      if (error.response?.data?.error) {
        if (typeof error.response.data.error === 'string') {
          errorMessage = error.response.data.error;
        } else if (typeof error.response.data.error === 'object') {
          errorMessage = Object.values(error.response.data.error).flat().join('\n');
        }
      }
      Alert.alert('Login Error', errorMessage);
      return null; // Return null on error to prevent further crashes
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
        await api.post('/signout', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('Token already expired, proceeding with logout.');
      } else {
        console.error('Logout error:', error.response?.data || error.message);
        Alert.alert('Logout Error', 'An error occurred while logging out.');
      }
    } finally {
      setAccessToken(null);
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('user');
    }
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        accessToken,
        loading,
        authLoaded, 
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
