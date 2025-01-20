import { Text, ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import CourseCard from "./CourseCard";

const CourseList = ({ data }) => {
  return (
    <ScrollView>
      {data.length > 0 ? (
        <View className="flex-wrap flex-row justify-between mx-5 gap-5 h-screen">
          {data.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              price={course.price}
              title={course.title}
              description={course.description}
              imageUrl={course.imageUrl}
            />
          ))}
        </View>
      ) : (
        <Text style={styles.noCourseText}>No courses available</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  noCourseText: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
  },
});

export default CourseList;
