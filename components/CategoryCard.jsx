import { Image, Text, View } from "react-native";
import React from "react";

export default function CategoryCard({ categoryName, imageUrl }) {
  return (
    <View className="w-[160px] h-[190px] bg-slate-50 rounded-2xl p-3 border border-gray-300">
      <View className="flex-1 justify-between">
        <View className="flex-1 items-center justify-center">
          <Image
            className="w-[130px] h-[130px]"
            source={imageUrl}
            resizeMode="contain"
          />
        </View>

        <View className="flex-row justify-center items-center w-full mt-2 px-1">
          <Text className="font-bold text-gray-800 text-lg" numberOfLines={2}>
            {categoryName}
          </Text>
        </View>
      </View>
    </View>
  );
}
