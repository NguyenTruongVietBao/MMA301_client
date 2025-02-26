import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useCallback, memo } from "react";
import { useRouter } from 'expo-router';
import { useMyCourseContext } from "../../context/MyCourseContext";
import Ionicons from "@expo/vector-icons/Ionicons";

const CourseCard = memo(({ course, onPress }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <TouchableOpacity 
      className="bg-white rounded-2xl p-4 mb-4 shadow-md mx-4 flex-row items-center border border-gray-100"
      onPress={onPress}
    >
      <Image
        source={{ uri: course.thumbnailUrl }}
        className="w-24 h-24 rounded-xl"
        resizeMode="cover"
        loading="lazy"
      />
      <View className="flex-1 ml-4">
        <Text className="text-lg font-bold text-gray-800 mb-1.5" numberOfLines={1}>
          {course.title}
        </Text>
        <Text className="text-gray-600 text-sm mb-3" numberOfLines={2}>
          {course.description}
        </Text>
        
        <View className="border-t border-gray-100 pt-2">
          <View className="flex-row space-x-12 mb-1.5">
            <Text className="text-gray-500 text-xs">
              Created: {formatDate(course.createdAt)}
            </Text>
            <Text className="text-gray-500 text-xs">
              Updated: {formatDate(course.updatedAt)}
            </Text>
          </View>
          
          <View className="flex-row items-center">
            <Ionicons name="person-outline" size={14} color="#6b7280" />
            <Text className="text-gray-500 text-xs ml-1">
              {course.author || "Not updated"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const MyCourses = () => {
  const router = useRouter();
  const { courses, fetchMyCourses } = useMyCourseContext();
  
  useEffect(() => {
    let mounted = true;
    if (fetchMyCourses) {
      fetchMyCourses().then(() => {
        if (!mounted) return;
      });
    }
    return () => { mounted = false; };
  }, [fetchMyCourses]);

  const handleCoursePress = useCallback((courseId) => {
    router.push({
      pathname: '/myCourse/myCourseDetail',
      params: { courseId }
    });
  }, [router]);

  if (!courses?.length) {
    return (
      <View className="flex-1 bg-gray-100 justify-center items-center">
        <Text className="text-gray-500 text-lg">
          No courses available
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      className="bg-gray-50 flex-1"
      removeClippedSubviews={true}
      initialNumToRender={5}
    >
      <View className="py-6">
        <Text className="text-2xl font-bold px-4 mb-6 text-gray-800">My Courses</Text>
        {courses.map((course) => (
          <CourseCard 
            key={course._id} 
            course={course} 
            onPress={() => handleCoursePress(course._id)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default memo(MyCourses);