import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
export default function CategoryCard({ categoryName, imageUrl }) {
  return (
    <View
      style={styles.shadow}
      className="w-[160px] h-[150px] bg-slate-50 rounded-2xl"
    >
      <View className="flex justify-between items-center h-ful">
        <Image
          className="flex-row justify-center mx-auto h-[80%] w-[80%]"
          source={imageUrl}
          resizeMode="contain"
        />
        <View className="flex-row justify-between items-center w-full px-4">
          <Text className="font-semibold text-gray-800 text-xl">
            {categoryName}
          </Text>
          <AntDesign name="arrowright" size={20} color="#333" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 }, // Right and bottom shadow
    shadowOpacity: 0.2,
    shadowRadius: 6, // Blur radius
    elevation: 6, // For Android
  },
});
