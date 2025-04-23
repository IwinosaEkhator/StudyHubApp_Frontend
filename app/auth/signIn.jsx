import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useContext, useState } from "react";
import {} from "react-native";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import images from "../../constants/images";
import { useNavigation } from "expo-router";
import { AuthContext } from "../../context/AuthContext";

const SignInScreen = () => {
  const navigation = useNavigation();

  // Destructure the login function from AuthContext
  const { login, loading } = useContext(AuthContext);

  // const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handler for registration
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    try {
      const result = await login(email, password);
      if (result) {
        navigation.navigate("User", { screen: "Home" });
      }
    } catch (error) {
      console.error("Login error in LoginScreen:", error);
      Alert.alert(
        "Login Error",
        error.response?.data?.error ||
          "An unexpected error occurred. Please try again."
      );
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView>
          <View className="w-full h-[100vh]">
            <Image
              source={images.signUpLibrary}
              style={{ width: "100%", height: "30%" }}
              resizeMethod="contain"
            />
            <View className="px-8 pt-20 pb-24 absolute bg-white left-0 right-0 bottom-0 rounded-t-[40px]">
              <Text className="text-3xl text-primary text-semibold font-bold">
                Sign In
              </Text>

              <FormField
                title="Email"
                value={email}
                handleChangeText={setEmail}
                otherStyles="mt-7"
                // errors={errors.mat_no}
              />

              <FormField
                title="Password"
                value={password}
                handleChangeText={setPassword}
                otherStyles="mt-7"
                // errors={errors.password}
              />

              <CustomButton
                title="Sign In"
                handlePress={handleLogin}
                containerStyles="my-14"
                loading={loading}
              />

              <View className="justify-center flex-row gap-2">
                <Text className="text-lg text-black font-pregular">
                  Don't have an account?
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                  <Text className="text-lg font-psemibold text-primary">
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInScreen;
