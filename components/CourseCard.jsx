import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { currencyFormat } from "../utils";

const CourseCard = ({ _id, title, price, thumbnailUrl, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} className="mx-4">
      <View className="p-2 bg-white rounded-3xl">
        <Image
          source={
            thumbnailUrl
              ? { uri: thumbnailUrl }
              : require("../assets/images/logo-music-1.png")
          }
          className="mx-auto h-[120px] w-[150px]"
          resizeMode="contain"
        />

        <View className="w-[150px] mx-auto">
          <View className="">
            <Text className="font-psemibold text-gray-800 text-xl">
              {title}
            </Text>
          </View>
          <View className="my-2">
            <Text className="font-pmedium text-slate-400 text-sm">
              2 Lessons
            </Text>
          </View>
          <View className="flex-row justify-end">
            <Text className="text-end text-[#4B6EF5] font-psemibold text-2xl">
              {currencyFormat.format(price)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CourseCard;
