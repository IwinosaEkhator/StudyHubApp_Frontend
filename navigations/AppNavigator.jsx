import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UserNavigator from './UserNavigator';
import AuthNavigator from './AuthNavigator';
import OnboardingScreen from '../app/OnBoardingScreen';
import SplashScreen from '../app/SplashScreen';
import BottomTabNavigator from './BottomTabNavigator';
import HomeScreen from "../app/library/homeScreen";
import InfoPage from "../app/library/infoPage";
import ReadBookScreen from "../app/library/readBooks";
import CategoryScreen from "../app/library/categoryScreen";
import profileScreen from "../app/profile/profileScreen";
import ProfileScreen from "../app/profile/profileScreen";
import ChatListScreen from "../app/chat/chatListScreen";
import ChatScreen from "../app/chat/chatScreen";
import PostScreen from "../app/community/postScreen";
import EditProfileScreen from "../app/profile/editProfileScreen";
import BookmarksScreen from "../app/library/bookmarkScreen";
import AddPeopleScreen from "../app/chat/addPeopleScreen";
import ShareInfoPage from "../app/library/shareInfoPage";

import { AuthContext } from '../context/AuthContext';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { authLoaded, user, profileComplete } = useContext(AuthContext);

  // Show nothing (or loading) until auth state is ready
  if (!authLoaded) return null;

  // Determine initial route based on auth/profile state
  const initialRoute = !user
    ? 'Auth'
    : !profileComplete
      ? 'Topics'
      : 'Main';

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      {/* Core flow screens */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="Topics" component={require('../app/auth/TopicsScreen').default} />
      <Stack.Screen name="Main" component={BottomTabNavigator} />

      {/* If you need deeper access outside tabs, include here or let BottomTabNavigator/UserNavigator handle these */}
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="infoPage" component={InfoPage} />
      <Stack.Screen name="ReadBook" component={ReadBookScreen} />
      <Stack.Screen
        name="Category"
        component={CategoryScreen}
        options={({ route }) => ({ title: route.params.type })}
      />

      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Bookmark" component={BookmarksScreen} />
      <Stack.Screen name="ChatList" component={ChatListScreen} />
      <Stack.Screen name="AddPeople" component={AddPeopleScreen} />
      <Stack.Screen
        name="ChatRoom"
        component={ChatScreen}
        options={({ route }) => ({ title: route.params.otherUser.username })}
      />
      <Stack.Screen name="Posts" component={PostScreen} />
      <Stack.Screen name="infoPage2" component={ShareInfoPage} />
    </Stack.Navigator>
  );
}
