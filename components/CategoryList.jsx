import React from "react";
import { View, Text } from "react-native";
import { Link } from "expo-router";
import CategoryCard from "./CategoryCard";

const defaultImages = [
  require("../assets/images/logo-music-1.png"),
  require("../assets/images/logo-music-2.png"),
  require("../assets/images/logo-music-3.png"),
];

const CategoryList = ({ data }) => {
  return (
    <View>
      {data.length > 0 ? (
        <View className="flex-wrap flex-row justify-between mx-9 gap-10">
          {data.map((category, index) => (
            <Link
              href={`/detailCategory/${category._id}?title=${category.title}`}
              key={category._id}
            >
              <CategoryCard
                categoryName={category.title}
                imageUrl={
                  category.imageUrl ||
                  defaultImages[index % defaultImages.length]
                }
              />
            </Link>
          ))}
        </View>
      ) : (
        <Text className="text-center text-lg text-gray-400">No category</Text>
      )}
    </View>
  );
};

export default CategoryList;
