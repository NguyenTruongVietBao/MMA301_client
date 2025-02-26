import { View, Text, ScrollView, TouchableOpacity, Image, Alert, Linking } from "react-native";
import React, { useState, useEffect, useCallback, memo } from "react";
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useMyCourseContext } from "../../context/MyCourseContext";

const ChapterCard = memo(({ chapter, onLessonPress, isExpanded, onToggle, completedLessons }) => {
  const handleDownloadDocument = async (documentUrl) => {
    try {
      await Linking.openURL(documentUrl);
    } catch (error) {
      console.error('Error opening document:', error);
      Alert.alert('Error', 'Unable to open document. Please try again later.');
    }
  };

  const isLessonCompleted = (lessonId) => {
    return completedLessons.includes(lessonId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <View className="bg-white rounded-2xl mb-4 mx-4 overflow-hidden shadow-lg">
      <TouchableOpacity
        className="flex-row justify-between items-center p-5 bg-blue-50"
        onPress={() => onToggle(isExpanded ? null : chapter._id)}
      >
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-800 mb-3">
            {chapter.title || "Course not updated"}
          </Text>
          <View className="flex-row space-x-12">
            <Text className="text-gray-600 text-xs pr-2">
              Created: {chapter.createdAt ? formatDate(chapter.createdAt) : "Not updated"}
            </Text>
            <Text className="text-gray-600 text-xs pr-2">
              Updated: {chapter.updatedAt ? formatDate(chapter.updatedAt) : "Not updated"}
            </Text>
          </View>
        </View>
        <Ionicons 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={28} 
          color="#3b82f6" 
        />
      </TouchableOpacity>

      {isExpanded && (
        <View className="border-t border-gray-100">
          {chapter.lessons && chapter.lessons.length > 0 ? (
            chapter.lessons.map((lesson, index) => (
              <View key={`${lesson._id}-${index}`} className="p-5 border-b border-gray-100">
                <TouchableOpacity
                  onPress={() => onLessonPress(lesson)}
                  className="flex-row justify-between items-center"
                >
                  <View className="flex-1">
                    <Text className="text-gray-800 font-semibold text-lg mb-1">
                      {lesson.title || "Lesson not updated"}
                    </Text>
                    <Text className="text-gray-500 text-sm leading-relaxed">
                      {lesson.description || "Content is being updated"}
                    </Text>
                  </View>
                  {isLessonCompleted(lesson._id) && (
                    <Ionicons name="checkmark-circle" size={28} color="#22c55e" />
                  )}
                </TouchableOpacity>
                
                <View className="flex-row items-center mt-4 space-x-4">
                  {lesson.videoUrl && (
                    <TouchableOpacity 
                      onPress={() => onLessonPress(lesson)}
                      className="flex-row items-center px-4 py-2 bg-blue-100 rounded-full"
                    >
                      <Ionicons name="videocam-outline" size={18} color="#3b82f6" />
                      <Text className="text-blue-600 text-sm ml-2 font-semibold">Video</Text>
                    </TouchableOpacity>
                  )}
                  {lesson.documentUrl && (
                    <TouchableOpacity 
                      onPress={() => handleDownloadDocument(lesson.documentUrl)}
                      className="flex-row items-center px-4 py-2 bg-green-100 rounded-full"
                    >
                      <Ionicons name="document-outline" size={18} color="#22c55e" />
                      <Text className="text-green-600 text-sm ml-2 font-semibold">Document</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          ) : (
            <View className="p-5 flex items-center justify-center">
              <Ionicons name="alert-circle-outline" size={24} color="#9ca3af" />
              <Text className="text-gray-400 text-base mt-2">No lessons available</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
});

const CourseDetail = () => {
  const { courseId } = useLocalSearchParams();
  const router = useRouter();
  const [expandedChapter, setExpandedChapter] = useState(null);
  const { currentCourse, fetchCourseDetail, getCompletedLessons } = useMyCourseContext();
  const [completedLessons, setCompletedLessons] = useState([]);
  
  useEffect(() => {
    let mounted = true;
    
    const initializeData = async () => {
      if (courseId) {
        await fetchCourseDetail(courseId);
        const completed = await getCompletedLessons();
        if (mounted) {
          setCompletedLessons(completed);
        }
      }
    };

    initializeData();
    return () => { mounted = false; };
  }, [courseId]);

  const handleLessonPress = useCallback((lesson) => {
    router.push({
      pathname: "/myCourse/courseVideo",
      params: {
        lessonId: lesson._id,
        title: lesson.title,
        description: lesson.description,
        videoUrl: lesson.videoUrl,
        documentUrl: lesson.documentUrl,
        createdAt: lesson.createdAt,
        updatedAt: lesson.updatedAt,
        author: lesson.author || "Chưa cập nhật"
      }
    });
  }, [router]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!currentCourse) {
    return (
      <View className="flex-1 bg-gray-100 justify-center items-center">
        <Text className="text-gray-500 text-lg">Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          headerTitle: "Course Detail",
          headerTitleStyle: { fontSize: 18 },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: 'white' },
        }} 
      />
      <ScrollView 
        className="bg-gray-50 flex-1"
        removeClippedSubviews={true}
        initialNumToRender={5}
      >
        <View className="py-6">
          <View className="px-4 mb-8">
            <Image 
              source={{ uri: currentCourse?.thumbnailUrl || 'default_thumbnail_url' }}
              className="w-full h-64 rounded-3xl mb-6 shadow-xl"
              resizeMode="cover"
            />
            <Text className="text-4xl font-bold mb-4 text-gray-800">
              {currentCourse?.title || "Course not updated"}
            </Text>
            <Text className="text-gray-600 text-base leading-relaxed mb-6">
              {currentCourse?.description || "Course content is being updated"}
            </Text>
            
            <View className="bg-white p-5 rounded-2xl shadow-md">
              <View className="flex-col space-y-2">
                <Text className="text-gray-600 text-sm font-medium">
                  Created: {currentCourse?.createdAt ? formatDate(currentCourse.createdAt) : "Not updated"}
                </Text>
                <Text className="text-gray-600 text-sm font-medium">
                  Updated: {currentCourse?.updatedAt ? formatDate(currentCourse.updatedAt) : "Not updated"}
                </Text>
              </View>
            </View>
          </View>

          {currentCourse.chapters && currentCourse.chapters.length > 0 ? (
            currentCourse.chapters.map((chapter, index) => (
              <ChapterCard
                key={`${chapter._id}-${index}`}
                chapter={chapter}
                onLessonPress={handleLessonPress}
                isExpanded={expandedChapter === chapter._id}
                onToggle={(id) => setExpandedChapter(id)}
                completedLessons={completedLessons}
              />
            ))
          ) : (
            <View className="mx-4 p-8 bg-white rounded-2xl shadow-lg">
              <View className="items-center">
                <Ionicons name="book-outline" size={48} color="#9ca3af" />
                <Text className="text-xl font-semibold text-gray-600 mt-4 text-center">
                  Chapters will be updated soon
                </Text>
                <Text className="text-gray-400 text-base mt-2 text-center">
                  Please check back later
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default memo(CourseDetail);
