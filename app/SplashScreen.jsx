import { useEffect, useContext } from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import { AuthContext } from "../context/AuthContext";
import icons from "../constants/icons";

export default function SplashScreen({ navigation }) {
  const { accessToken } = useContext(AuthContext);

  useEffect(() => {
    setTimeout(() => {
      // If accessToken exists, navigate to "Main"; else, navigate to "Onboarding"
      if (accessToken) {
        navigation.replace("Main");
      } else {
        navigation.replace("Onboarding");
      }
    }, 2000);
  }, [accessToken]);

  return (
    <View style={styles.container}>
      <View className="flex-row items-center">
        <Image
          source={icons.temLogo}
          className="w-[80px] h-[88px]"
          resizeMode="contain"
        />
        <Text className="ms-3 my-0 text-5xl font-bold">StudyHub</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
