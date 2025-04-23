import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import UserNavigator from "./UserNavigator";
import AuthNavigator from "./AuthNavigator";
import OnboardingScreen from "../app/OnBoardingScreen";
import SplashScreen from "../app/SplashScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {

  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Auth" component={AuthNavigator} />
          <Stack.Screen name="User" component={UserNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}
