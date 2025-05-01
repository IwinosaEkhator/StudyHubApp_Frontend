import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import UserNavigator from "./UserNavigator";
import AuthNavigator from "./AuthNavigator";
import OnboardingScreen from "../app/OnBoardingScreen";
import SplashScreen from "../app/SplashScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import HomeScreen from "../app/library/homeScreen";
import InfoPage from "../app/library/infoPage";
import ReadBookScreen from "../app/library/readBooks";
import CategoryScreen from "../app/library/categoryScreen";
import ProfileScreen from "../app/profile/profileScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Splash"
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Main" component={BottomTabNavigator} />
        <Stack.Screen name="User" component={UserNavigator} />

        {/* User Screens */}

        {/* Dashboard */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="infoPage" component={InfoPage} />
        <Stack.Screen name="ReadBook" component={ReadBookScreen} />
        <Stack.Screen
          name="Category"
          component={CategoryScreen}
          options={({ route }) => ({ title: route.params.type })}
        />

        {/* Profile Screens */}
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </>
  );
}
