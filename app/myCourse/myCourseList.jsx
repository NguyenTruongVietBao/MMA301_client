import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useCallback, memo } from "react";
import { useRouter } from 'expo-router';
import { useMyCourseContext } from "../../context/MyCourseContext";

const CourseCard = memo(({ course, onPress }) => (
  <TouchableOpacity 
    className="bg-white rounded-xl p-3 mb-3 shadow-sm mx-4 flex-row items-center"
    onPress={onPress}
  >
    <Image
      source={{ uri: course.thumbnailUrl }}
      className="w-20 h-20 rounded-lg"
      resizeMode="cover"
      loading="lazy"
    />
    <View className="flex-1 ml-4">
      <Text className="text-lg font-semibold mb-1">{course.title}</Text>
      <Text className="text-gray-500 text-sm">{course.description}</Text>
      <Text className="text-gray-500 text-sm">Giá: {course.price} VNĐ</Text>
    </View>
  </TouchableOpacity>
));

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
          Chưa có khóa học nào
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      className="bg-gray-100 flex-1"
      removeClippedSubviews={true}
      initialNumToRender={5}
    >
      <View className="py-4">
        <Text className="text-2xl font-bold px-4 mb-4">Danh sách khóa học</Text>
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