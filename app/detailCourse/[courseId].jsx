import {
  View,
  Text,
  Image,
  ScrollView,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import sampleDataCourse from "../../constants/courses"; // Assuming course data exists here
import { Dropdown } from "react-native-element-dropdown";
import { AntDesign } from "@expo/vector-icons";
import axiosInstance from "../../utils/axiosInstance";

const CourseDetailScreen = () => {
  const { courseId } = useLocalSearchParams();
  const [value, setValue] = useState(null);
  const [course, setCourse] = useState(null); // Store course data
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const fetchCourseDetails = async () => {
    try {
      const response = await axiosInstance.get(`/courses/${courseId}`);
      setCourse(response.data); // Assuming response.data contains course details
    } catch (err) {
      console.error("Error fetching course details:", err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (courseId) fetchCourseDetails();
  }, [courseId]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B6EF5" />
        <Text>Loading course details...</Text>
      </View>
    );
  }
  return (
    <View className="h-screen flex-1 bg-slate-100">
      <ScrollView>
        <View className="h-screen w-full flex justify-start items-center">
          {/* Image Section */}
          <Image
            source={
              course.thumbnailUrl
                ? { uri: course.thumbnailUrl }
                : require("../../assets/images/logo-music-1.png") // Fallback image
            }
            style={{ width: "100%", height: 360 }}
            resizeMode="contain"
          />

          {/* Content Section */}
          <View className="flex-col items-start mt-4 px-10">
            {/* Course Title */}
            <Text className="text-4xl text-start font-psemibold py-2">
              {course.title}
            </Text>
            <Text className="text-base text-slate-400 text-start font-psemibold mb-5 py-2">
              Category
            </Text>
            {/* Description and Price */}

            <View className="flex-row justify-between w-full gap-2">
              <View className="w-2/3">
                <Text className="text-lg font-pbold">About the course </Text>
                <Text className="font-pmedium">
                  {course.description} {course.description} {course.description}
                </Text>
              </View>
              <View className="flex items-center w-1/3">
                <Text className="text-5xl font-pbold text-[#4B6EF5] py-3">
                  ${course.price}
                </Text>
                <Text className="text-sm font-pmedium text-slate-400">
                  200 Students
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* Footer */}
      <View className="absolute bottom-0 w-full bg-white border-t border-gray-200 py-4 px-6">
        <View className="flex flex-row items-center justify-between">
          <View className="w-1/5 flex items-center">
            <TouchableOpacity onPress={() => {}}>
              <AntDesign name="hearto" size={24} color="#4B6EF5" />
            </TouchableOpacity>
          </View>
          <View className="ml-2 w-4/5">
            <TouchableOpacity
              className="bg-[#4B6EF5] py-4 rounded-full"
              onPress={() => {}}
            >
              <Text className="text-white text-center font-bold text-lg">
                Buy now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CourseDetailScreen;
const styles = StyleSheet.create({
  dropdown: {
    width: "100%",
    paddingLeft: 10,
    margin: 16,
    height: 50,
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
