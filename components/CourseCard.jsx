import { View, Text, Image } from "react-native";
import React from "react";
import { Link } from "expo-router";

const CourseCard = ({ _id, title, price, category, description, thumbnailUrl }) => {
  return (
    <Link href={`/detailCourse/${_id}`}>
      <View className="w-[180px] h-[250px] gap-5 bg-white rounded-3xl">
        <Image
            source={
              thumbnailUrl
                  ? { uri: thumbnailUrl } // Remote image
                  : require("../assets/images/logo-music-1.png") // Fallback image
            }
            className="mx-auto h-[120px] w-[80%]"
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
