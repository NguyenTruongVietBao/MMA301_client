import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { WebView } from 'react-native-webview';
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useMyCourseContext } from "../../context/MyCourseContext";
import { useAuthContext } from "../../context/AuthContext";
import { Linking } from "react-native";

const VideoPlayer = React.memo(({ videoUrl }) => {
  const [isLoading, setIsLoading] = useState(true);

  if (!videoUrl) {
    return null;
  }

  const encodedVideoUrl = encodeURI(videoUrl);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; }
          html, body { width: 100%; height: 100%; background: black; }
          video {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        </style>
      </head>
      <body>
        <video controls playsinline webkit-playsinline>
          <source src="${encodedVideoUrl}" type="video/mp4">
        </video>
      </body>
    </html>
  `;

  return (
    <View style={{ width: '100%', height: 300, backgroundColor: 'black' }}>
      {isLoading && (
        <ActivityIndicator 
          size="large" 
          color="#fff" 
          style={{ position: 'absolute', top: '50%', left: '50%' }} 
        />
      )}
      <WebView
        source={{ html: htmlContent }}
        style={{ backgroundColor: 'black' }}
        allowsFullscreenVideo
        mediaPlaybackRequiresUserAction={false}
        onLoadEnd={() => setIsLoading(false)}
      />
    </View>
  );
});

const CourseVideo = () => {
  const params = useLocalSearchParams();
  const { 
    lessonId, 
    title, 
    description, 
    videoUrl, 
    createdAt, 
    updatedAt, 
    author 
  } = params;
  const { updateLessonProgress, getCompletedLessons } = useMyCourseContext();
  const { authState } = useAuthContext();
  const router = useRouter();
  
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [completedLessons, setCompletedLessons] = useState([]);

  // Tạo object lesson từ params để giống với myCourseDetail
  const currentLesson = {
    _id: lessonId,
    title: title,
    videoUrl: videoUrl,
    createdAt: createdAt,
    updatedAt: updatedAt
  };
  
  // Kiểm tra lesson đã hoàn thành
  useEffect(() => {
    const checkCompletion = async () => {
      try {
        const completed = await getCompletedLessons();
        console.log("Completed lessons:", completed);
        console.log("Current lesson ID:", lessonId);
        
        // Lưu danh sách lessons đã hoàn thành
        setCompletedLessons(completed);
        
        // Kiểm tra lesson hiện tại có trong danh sách hoàn thành không
        const isLessonCompleted = completed.includes(lessonId);
        console.log("Is lesson completed:", isLessonCompleted);
        
        setIsCompleted(isLessonCompleted);
      } catch (error) {
        console.error("Lỗi kiểm tra hoàn thành:", error);
      } finally {
        setIsChecking(false);
      }
    };

    if (lessonId) {
      checkCompletion();
    }
  }, [lessonId]);

  // Xử lý hoàn thành bài học
  const handleComplete = useCallback(async () => {
    if (isLoading || isCompleted) return;
    
    // Kiểm tra lại một lần nữa trước khi cập nhật
    if (completedLessons.includes(lessonId)) {
      Alert.alert("Thông báo", "Bài học này đã được hoàn thành!");
      setIsCompleted(true);
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await updateLessonProgress(lessonId);
      if (result.success) {
        // Cập nhật danh sách lessons đã hoàn thành
        setCompletedLessons(prev => [...prev, lessonId]);
        setIsCompleted(true);
        Alert.alert("Thành công", result.message || "Đã hoàn thành bài học");
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      Alert.alert("Lỗi", error.message || "Không thể cập nhật tiến độ. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, isCompleted, lessonId, completedLessons]);

  // Format date
  const formatDate = (dateString) => {
    try {
      if (!dateString) return "No data";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "No data";
      return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return "No data";
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          headerTitle: title || "Lesson",
          headerTitleStyle: { fontSize: 18 },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: 'white' },
        }} 
      />

      <ScrollView className="flex-1 bg-white">
        <View className="bg-black">
          <VideoPlayer videoUrl={videoUrl} />
        </View>

        <View className="p-5">
          {/* Complete Button */}
          <TouchableOpacity
            onPress={handleComplete}
            disabled={isLoading || isCompleted || isChecking}
            className={`p-4 rounded-xl flex-row items-center justify-center ${
              isCompleted ? "bg-[#4ade80]" : "bg-[#3b82f6]"
            }`}
          >
            {isChecking ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons
                  name={isCompleted ? "checkmark-circle" : "bookmark-outline"}
                  size={24}
                  color="white"
                />
                <Text className="text-white font-semibold text-lg ml-2">
                  {isLoading 
                    ? "Processing..." 
                    : isCompleted 
                      ? "Completed" 
                      : "Mark as Complete"}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Lesson Info */}
          <View className="mt-6 p-4 bg-gray-50 rounded-xl">
            <View className="flex-row items-center mb-2">
              <Ionicons name="time-outline" size={20} color="#6b7280" />
              <Text className="text-gray-600 ml-2">
                Created: {formatDate(createdAt)}
              </Text>
            </View>
            
            <View className="flex-row items-center mb-2">
              <Ionicons name="refresh-outline" size={20} color="#6b7280" />
              <Text className="text-gray-600 ml-2">
                Updated: {formatDate(updatedAt)}
              </Text>
            </View>

            {author && (
              <View className="flex-row items-center">
                <Ionicons name="person-outline" size={20} color="#6b7280" />
                <Text className="text-gray-600 ml-2">
                  Author: {author || "Not updated"}
                </Text>
              </View>
            )}
          </View>

          {/* Notes */}
          <View className="mt-6">
            <Text className="text-gray-800 font-semibold mb-3">Notes:</Text>
            <Text className="text-gray-600 mb-2">• Watch the entire video to understand the lesson content</Text>
            <Text className="text-gray-600 mb-2">• Complete assigned exercises (if any)</Text>
            <Text className="text-gray-600">• Mark as complete when you've mastered the material</Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default CourseVideo;
