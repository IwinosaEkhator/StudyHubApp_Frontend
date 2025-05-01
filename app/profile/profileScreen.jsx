import { View, Text, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native";
import icons from "../../constants/icons";

export default function ProfileScreen({ navigation }) {
  return (
    <>
      <SafeAreaView classname="bg-white w-full h-full">
        <View>
          {/* Navigation Back */}
          <View classname="flex-row justify-between items-center">
            <Image
              source={icons.blackArrowBack}
              classname="w-[24px] h-[24px]"
              resizeMethod="contain"
            />
            <Text>Profile</Text>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
