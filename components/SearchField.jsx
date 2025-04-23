import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import icons from "../constants/icons";


const SearchField = ({
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  errors = [],
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <View className="w-full h-16 px-4 bg-secondary rounded-3xl items-center flex-row">
        <Image
            source={icons.search}
            className="w-6 h-6 me-3"
            resizeMethod="contain"
        />

        <TextInput
          className="flex-1 w-full text-primary font-psemibold text-base"
          value={value}
          placeholder="Search..."
          placeholderTextColor="7b7b8b"
          onChangeText={handleChangeText}
        />

      </View>

      {/* {errors.map((error) => {
          return <Text key={error} className="text-red-600 mt-2">{error}</Text>
      })} */}
    </View>
  );
};

export default SearchField;
