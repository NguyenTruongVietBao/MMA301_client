import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
} from "react-native";
import React, { useEffect, useCallback, memo, useState, useMemo } from "react";
import { useRouter } from "expo-router";
import { useMyCourseContext } from "../../context/MyCourseContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { formatDate } from "../../utils";

const MyCourses = () => {
  const router = useRouter();
  const { courses, fetchMyCourses } = useMyCourseContext();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadCourses = async () => {
      try {
        await fetchMyCourses();
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadCourses();
    return () => {
      mounted = false;
    };
  }, [fetchMyCourses]);

  const handleCoursePress = useCallback(
    (courseId) => {
      router.push({
        pathname: "/myCourse/myCourseDetail",
        params: { courseId },
      });
    },
    [router]
  );

  // Filter courses based on search query
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses;

    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.author?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);

  return (
    <ScrollView
      className="flex-1 bg-slate-100"
      removeClippedSubviews={true}
      initialNumToRender={5}
    >
      {/* Header Section */}
      <View className="bg-[#4B6EF5] p-6 pb-8 rounded-3xl m-3">
        <Text className="text-2xl font-bold text-white mb-2">
          Let's begin learning!
        </Text>
        <Text className="text-white text-base mb-4">
          Continue your learning journey
        </Text>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white rounded-2xl p-3 shadow-sm">
          <Ionicons name="search-outline" size={20} color="#6B7280" />
          <TextInput
            placeholder="Search courses"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-2 text-gray-700"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Courses Section */}
      <View className="px-4 pt-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-pbold text-gray-800">
            {searchQuery ? "Kết quả tìm kiếm" : "Khóa học của tôi"}
          </Text>
          <Text className="text-gray-500 text-sm font-psemibold">
            {filteredCourses.length}{" "}
            {filteredCourses.length === 1 ? "khóa học" : "khóa học"}
          </Text>
        </View>

        {isLoading ? (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color="#4461F2" />
            <Text className="text-gray-600 mt-4">Đang tải khóa học...</Text>
          </View>
        ) : !filteredCourses.length ? (
          <View className="flex-1 justify-center items-center py-20">
            {searchQuery ? (
              <>
                <Ionicons name="search-outline" size={48} color="#9CA3AF" />
                <Text className="text-gray-500 text-lg mt-4">
                  Không tìm thấy khóa học
                </Text>
                <Text className="text-gray-400 text-sm mt-2">
                  Thử từ khóa khác
                </Text>
              </>
            ) : (
              <>
                <Ionicons name="book-outline" size={48} color="#9CA3AF" />
                <Text className="text-gray-500 text-lg mt-4">
                  Chưa có khóa học nào
                </Text>
              </>
            )}
          </View>
        ) : (
          <View className="pb-28">
            {filteredCourses.map((course) => (
              <TouchableOpacity
                key={course._id}
                className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden border border-gray-100"
                onPress={() => handleCoursePress(course._id)}
                activeOpacity={0.7}
              >
                <View className="flex-row h-36">
                  <Image
                    source={{ uri: course.thumbnailUrl }}
                    className="w-36 h-full"
                    resizeMode="cover"
                  />
                  <View className="flex-1 p-4 justify-between">
                    <View>
                      <Text
                        className="text-lg font-bold text-gray-800 mb-1"
                        numberOfLines={1}
                      >
                        {course.title}
                      </Text>
                      <Text
                        className="text-gray-600 text-sm leading-5"
                        numberOfLines={2}
                      >
                        {course.description}
                      </Text>
                    </View>

                    <View className="flex-row items-center justify-between mt-3 pt-2 border-t border-gray-100">
                      <View className="flex-row items-center">
                        <Ionicons
                          name="person-outline"
                          size={16}
                          color="#4B6EF5"
                        />
                        <Text className="text-blue-500 text-xs font-medium ml-1">
                          {course.author || "Chưa cập nhật"}
                        </Text>
                      </View>

                      <View className="flex-row items-center space-x-4">
                        <View className="flex-row items-center">
                          <Ionicons
                            name="videocam-outline"
                            size={16}
                            color="#6B7280"
                          />
                          <Text className="text-gray-500 text-xs font-medium ml-1">
                            {course.videoCount || 0} bài học
                          </Text>
                        </View>

                        <View className="flex-row items-center">
                          <Ionicons
                            name="time-outline"
                            size={16}
                            color="#6B7280"
                          />
                          <Text className="text-gray-500 text-xs font-medium ml-1">
                            {formatDate(course.updatedAt)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default memo(MyCourses);
