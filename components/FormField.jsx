import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";

// import { icons } from "../constants";

const FormField = ({
  title,
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
      <Text className="text-base text-primary font-pmedium text-lg mb-3">{title}</Text>
      <View className="border-2 border-gray-300 w-full h-16 px-4 bg-white rounded-2xl focus:border-yellow items-center flex-row">
        <TextInput
          className="flex-1 w-full text-primary font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {/* <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMethod="contain"
            /> */}
          </TouchableOpacity>
        )}
      </View>
      {errors.map((error) => {
          return <Text key={error} className="text-red-600 mt-2">{error}</Text>
      })}
    </View>
  );
};

export default FormField;
