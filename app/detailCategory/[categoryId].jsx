import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Footer from "../../components/Footer";
import CourseList from "../../components/CourseList";
import sampleDataCourse from "../../constants/courses";

export default function Index() {
  const { categoryId } = useLocalSearchParams();

  const courses = sampleDataCourse.courses.filter(
    (course) => course.categoryId === categoryId
  );
  console.log("courses of id", courses);

  return (
    <View className="bg-slate-100">
      <Text className="text-3xl font-psemibold m-5">Courses</Text>
      <Text className="text-xl font-psemibold mx-auto mb-10">Search</Text>
      <CourseList data={courses} />
    </View>
  );
}
