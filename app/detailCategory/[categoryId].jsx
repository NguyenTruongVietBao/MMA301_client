import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import CourseList from "../../components/CourseList";
import axiosInstance from "../../utils/axiosInstance";

export default function Index() {
  const { categoryId } = useLocalSearchParams(); // Get categoryId from route parameters
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchCourses = async () => {
    try {
      setIsLoading(true); // Show loading spinner
      const response = await axiosInstance.get(
        `/courses/category/${categoryId}`
      );
      setCourses(response.data?.data || []); // Set courses data
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };
  useEffect(() => {
    if (categoryId) {
      fetchCourses();
    }
  }, [categoryId]);

  return (
    <View className="bg-slate-100 h-full">
      <Text className="text-3xl font-psemibold m-5">Courses</Text>
      <Text className="text-xl font-psemibold mx-auto mb-10">Search</Text>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ marginTop: 20 }}
        />
      ) : courses.length > 0 ? (
        <CourseList data={courses} />
      ) : (
        <Text className="text-center text-lg mt-10">No courses found</Text>
      )}
    </View>
  );
}
