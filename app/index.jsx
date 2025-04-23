import { View, Text } from "react-native";
import React, { useEffect } from "react";
import HomeScreen from "./library/homeScreen";
import "../global.css";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "../navigations/AppNavigator";
import { AuthProvider } from "../context/AuthContext";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";

const index = () => {
  // const [fontsLoaded, error] = useFonts({
  //   "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
  //   "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  //   "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
  //   // "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
  //   "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
  //   "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
  //   "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
  //   "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  //   "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  // });

  // useEffect(() => {
  //   if (error) throw error;

  //   // if (fontsLoaded) SplashScreen.hideAsync();
  // }, [fontsLoaded, error]);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
};

export default index;
