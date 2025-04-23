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

const SignUpScreen = () => {
  const navigation = useNavigation();
  // Destructure the register function from AuthContext
  const { register, loading } = useContext(AuthContext);

  // State variables for each input field
  const [username, setUsername] = useState("");
  // const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handler for registration
  const handleRegister = async () => {
    // Basic client-side validations
    if (!username || !email || !password) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    try {
      // Call the register function from AuthContext including username
      const result = await register(username, email, password);
      console.log("Register result:", result); // Log the full response for debugging
      if (result) {
        // Navigate to HomeScreen with the email from the result
        navigation.navigate("User", { screen: "Home" });
        console.log("Registration Successful");
      } else {
        Alert.alert(
          "Registration Error",
          "Registration failed: no result returned."
        );
      }
    } catch (error) {
      console.log("Registration error in RegisterScreen catch:", error);
      Alert.alert(
        "Registration Error",
        error.response?.data?.error ||
          error.message ||
          "An error occurred. Please try again."
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
            <View className="px-8 pt-14 pb-10 absolute bg-white left-0 right-0 bottom-0 rounded-t-[40px]">
              <Text className="text-3xl text-primary text-semibold font-bold">
                Sign Up
              </Text>

              <FormField
                title="Username"
                value={username}
                handleChangeText={setUsername}
                otherStyles="mt-7"
                // errors={errors.username}
              />

              <FormField
                title="Email"
                value={email}
                handleChangeText={setEmail}
                otherStyles="mt-7"
                // errors={errors.email}
              />

              <FormField
                title="Password"
                value={password}
                handleChangeText={setPassword}
                otherStyles="mt-7"
                // errors={errors.password}
              />

              <CustomButton
                title="Sign Up"
                handlePress={handleRegister}
                containerStyles="my-10"
                loading={loading}
              />

              <View className="justify-center flex-row gap-2">
                <Text className="text-lg text-black font-pregular">
                  Have an account already?
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
                  <Text className="text-lg font-psemibold text-primary">
                    Sign In
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

export default SignUpScreen;
