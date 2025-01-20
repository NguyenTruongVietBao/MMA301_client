import { View, Text, Image } from "react-native";
import React from "react";
import { Link } from "expo-router";

const CourseCard = ({ id, title, description, price, imageUrl }) => {
  return (
    <Link href={`/detailCourse/${id}`}>
      <View className="w-[180px] h-[270px] bg-white rounded-3xl">
        <Image
          className="mx-auto h-[160px] w-[80%]"
          source={imageUrl}
          resizeMode="contain"
        />
        <View className="w-full ml-4">
          <View className="py-1">
            <Text className="text-[#4B6EF5] font-psemibold text-2xl">
              ${price}
            </Text>
          </View>
          <View className="pb-1">
            <Text className="font-psemibold text-gray-800 text-lg">
              {title}
            </Text>
          </View>
          <View className="">
            <Text className="font-pmedium text-slate-400 text-sm">
              291 Students
            </Text>
          </View>
        </View>
      </View>
    </Link>
  );
};

export default CourseCard;
