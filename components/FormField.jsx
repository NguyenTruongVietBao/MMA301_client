import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Feather from "@expo/vector-icons/Feather";

export const FormField = ({
  title,
  value,
  handleChangeText,
  otherStyles,
  placeholder,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className={"text-lg font-pmedium"}>{title}</Text>
      <View
        className={
          "w-full min-h-16 flex-row items-center border-2 border-black bg-slate-50 rounded-xl px-4"
        }
      >
        <TextInput
          style={{
            flex: 1,
            fontSize: 16,
            textAlignVertical: "center",
            paddingVertical: 0,
          }}
          className=""
          value={value}
          placeholder={placeholder}
          placeholderTextColor={"#cecece"}
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          {...props}
        />
        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
