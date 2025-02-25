import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect, useCallback, memo } from "react";
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMyCourseContext } from "../../context/MyCourseContext";

const ChapterCard = memo(({ chapter, onLessonPress, isExpanded, onToggle }) => {
  return (
    <View className="bg-white rounded-xl mb-3 mx-4 overflow-hidden">
      <TouchableOpacity
        className="flex-row justify-between items-center p-4"
        onPress={() => onToggle(isExpanded ? null : chapter._id)}
      >
        <View className="flex-1">
          <Text className="text-lg font-semibold">{chapter.title}</Text>
          <Text className="text-gray-500 text-sm">{chapter.description}</Text>
        </View>
        <Ionicons 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={24} 
          color="#0066cc" 
        />
      </TouchableOpacity>

      {isExpanded && chapter.lessons && chapter.lessons.length > 0 && (
        <View className="border-t border-gray-100">
          {chapter.lessons.map((lesson, index) => (
            <TouchableOpacity
              key={`${lesson._id}-${index}`}
              className="p-4 border-b border-gray-100"
              onPress={() => onLessonPress(lesson)}
            >
              <Text className="text-gray-800 font-medium">{lesson.title}</Text>
              <Text className="text-gray-500 text-sm mt-1">{lesson.description}</Text>
              <View className="flex-row items-center mt-2">
                {lesson.videoUrl && (
                  <View key={`video-${lesson._id}`} className="flex-row items-center mr-4">
                    <Ionicons name="videocam-outline" size={14} color="#3b82f6" />
                    <Text className="text-blue-500 text-xs ml-1">Video</Text>
                  </View>
                )}
                {lesson.documentUrl && (
                  <View key={`doc-${lesson._id}`} className="flex-row items-center">
                    <Ionicons name="document-outline" size={14} color="#3b82f6" />
                    <Text className="text-blue-500 text-xs ml-1">Tài liệu</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
});

const CourseDetail = () => {
  const { courseId } = useLocalSearchParams();
  const router = useRouter();
  const [expandedChapter, setExpandedChapter] = useState(null);
  const { currentCourse, fetchCourseDetail } = useMyCourseContext();
  
  useEffect(() => {
    let mounted = true;
    if (courseId) {
      fetchCourseDetail(courseId).then(() => {
        if (!mounted) return;
      });
    }
    return () => { mounted = false; };
  }, [courseId]);

  const handleLessonPress = useCallback((lesson) => {
    router.push({
      pathname: "/myCourse/courseVideo",
      params: {
        lessonId: lesson._id,
        title: lesson.title,
        description: lesson.description || "",
        videoUrl: lesson.videoUrl
      }
    });
  }, [router]);

  if (!currentCourse) {
    return (
      <View className="flex-1 bg-gray-100 justify-center items-center">
        <Text className="text-gray-500 text-lg">Đang tải...</Text>
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
        <View className="px-4 mb-6">
          <Image 
            source={{ uri: currentCourse.thumbnailUrl }}
            className="w-full h-48 rounded-xl mb-4"
            resizeMode="cover"
          />
          <Text className="text-2xl font-bold mb-2">{currentCourse.title}</Text>
          <Text className="text-gray-600">{currentCourse.description}</Text>
        </View>

        {currentCourse.chapters && currentCourse.chapters.map((chapter, index) => (
          <ChapterCard
            key={`${chapter._id}-${index}`}
            chapter={chapter}
            onLessonPress={handleLessonPress}
            isExpanded={expandedChapter === chapter._id}
            onToggle={(id) => setExpandedChapter(id)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default memo(CourseDetail);
