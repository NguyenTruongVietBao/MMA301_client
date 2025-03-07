import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, TextInput } from "react-native";
import React, { useEffect, useCallback, memo, useState, useMemo } from "react";
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
          <View className="flex-row justify-between mb-1.5">
            <Text className="text-gray-500 text-xs">
              Created: {formatDate(course.createdAt)}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="videocam-outline" size={14} color="#6b7280" />
              <Text className="text-gray-500 text-xs ml-1">
                {course.videoCount || 0} videos
              </Text>
            </View>
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
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
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
    return () => { mounted = false; };
  }, [fetchMyCourses]);

  const handleCoursePress = useCallback((courseId) => {
    router.push({
      pathname: '/myCourse/myCourseDetail',
      params: { courseId }
    });
  }, [router]);

  // Filter courses based on search query
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses;
    
    return courses.filter(course => 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.author?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <ScrollView 
      className="flex-1 bg-[#F5F7FF]"
      removeClippedSubviews={true}
      initialNumToRender={5}
    >
      {/* Header Section */}
      <View className="bg-[#4B6EF5] p-6 pb-8 rounded-b-3xl">
        <Text className="text-2xl font-bold text-white mb-2">Let's begin learning!</Text>
        <Text className="text-white text-base mb-4">Continue your learning journey</Text>
        
        {/* Search Bar */}
        <View className="flex-row items-center bg-white rounded-xl p-3 shadow-sm">
          <Ionicons name="search-outline" size={20} color="#6B7280" />
          <TextInput
            placeholder="Search courses"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-2 text-gray-700"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Courses Section */}
      <View className="px-4 pt-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-gray-800">
            {searchQuery ? 'Search Results' : 'My Courses'}
          </Text>
          <Text className="text-gray-500 text-sm">
            {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
          </Text>
        </View>

        {isLoading ? (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color="#4461F2" />
            <Text className="text-gray-600 mt-4">Loading courses...</Text>
          </View>
        ) : !filteredCourses.length ? (
          <View className="flex-1 justify-center items-center py-20">
            {searchQuery ? (
              <>
                <Ionicons name="search-outline" size={48} color="#9CA3AF" />
                <Text className="text-gray-500 text-lg mt-4">No courses found</Text>
                <Text className="text-gray-400 text-sm mt-2">Try different keywords</Text>
              </>
            ) : (
              <>
                <Ionicons name="book-outline" size={48} color="#9CA3AF" />
                <Text className="text-gray-500 text-lg mt-4">No courses available</Text>
              </>
            )}
          </View>
        ) : (
          filteredCourses.map((course) => (
            <TouchableOpacity 
              key={course._id}
              className="bg-white rounded-2xl mb-4 shadow-sm border border-gray-50 overflow-hidden"
              onPress={() => handleCoursePress(course._id)}
            >
              <Image
                source={{ uri: course.thumbnailUrl }}
                className="w-full h-40"
                resizeMode="cover"
              />
              <View className="p-4">
                <Text className="text-lg font-bold text-gray-800 mb-2" numberOfLines={1}>
                  {course.title}
                </Text>
                <Text className="text-gray-600 text-sm mb-3" numberOfLines={2}>
                  {course.description}
                </Text>
                
                <View className="flex-row items-center justify-between border-t border-gray-100 pt-3">
                  <View className="flex-row items-center">
                    <Ionicons name="person-outline" size={16} color="#6B7280" />
                    <Text className="text-gray-500 text-xs ml-1">
                      {course.author || "Not updated"}
                    </Text>
                  </View>
                  
                  <View className="flex-row items-center space-x-4">
                    <View className="flex-row items-center">
                      <Ionicons name="videocam-outline" size={16} color="#6B7280" />
                      <Text className="text-gray-500 text-xs ml-1">
                        {course.videoCount || 0} videos
                      </Text>
                    </View>
                    
                    <View className="flex-row items-center">
                      <Ionicons name="time-outline" size={16} color="#6B7280" />
                      <Text className="text-gray-500 text-xs ml-1">
                        {formatDate(course.updatedAt)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default memo(MyCourses);