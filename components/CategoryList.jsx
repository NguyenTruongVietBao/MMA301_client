// many CategoryCard

import { View, Text } from "react-native";
import React from "react";
import CategoryCard from "./CategoryCard";
import { Link } from "expo-router";

const CategoryList = ({ data }) => {
  return (
    <View>
      {data.length > 1 ? (
        <View className="flex-wrap flex-row justify-between mx-9 gap-10">
          {data.map((category) => (
            <Link href={`/detailCategory/${category.id}`} key={category.id}>
              <CategoryCard
                categoryName={category.categoryName}
                imageUrl={category.imageUrl}
              />
            </Link>
          ))}
        </View>
      ) : (
        <>No category</>
      )}
    </View>
  );
};

export default CategoryList;
