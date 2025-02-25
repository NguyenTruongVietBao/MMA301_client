import React, { useState, useCallback, useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Video } from 'expo-av';
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useMyCourseContext } from "../../context/MyCourseContext";
import { useAuthContext } from "../../context/AuthContext";

const VideoPlayer = React.memo(({ url, onError }) => {
  const videoRef = useRef(null);

  const getProcessedUrl = (url) => {
    try {
      if (!url) return '';
      
      const cleanUrl = url.trim();
      
      // Xử lý URL Firebase Storage
      if (cleanUrl.includes('firebase')) {
        // Nếu URL đã có alt=media, trả về nguyên bản
        if (cleanUrl.includes('alt=media')) {
          return cleanUrl;
        }
        // Nếu chưa có alt=media, thêm vào
        return cleanUrl + (cleanUrl.includes('?') ? '&' : '?') + 'alt=media';
      }
      return cleanUrl;
    } catch (error) {
      console.error("Lỗi xử lý URL:", error);
      onError && onError(new Error("Lỗi xử lý URL video"));
      return '';
    }
  };

  const processedUrl = getProcessedUrl(url);
  
  if (!processedUrl) {
    onError && onError(new Error("URL video không hợp lệ"));
    return null;
  }

  return (
    <Video
      ref={videoRef}
      source={{ uri: processedUrl }}
      useNativeControls
      resizeMode="contain"
      style={{ width: '100%', height: 300 }}
      shouldPlay={false}
      isMuted={false}
      onError={(error) => {
        console.error("Video error:", error);
        onError && onError(error);
      }}
    />
  );
});

const CourseVideo = () => {
  const params = useLocalSearchParams();
  const { lessonId, title, description, videoUrl } = params;
  const { updateLessonProgress } = useMyCourseContext();
  
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const handleVideoError = useCallback((error) => {
    console.error('Lỗi video:', error);
    if (retryCount < 2) {
      setRetryCount(prev => prev + 1);
      setVideoError(false); // Reset error để thử lại
    } else {
      setVideoError(true);
      Alert.alert(
        "Lỗi phát video",
        "Không thể phát video. Vui lòng kiểm tra kết nối mạng và thử lại sau."
      );
    }
  }, [retryCount]);

  const handleComplete = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const newStatus = !isCompleted;
      await updateLessonProgress(lessonId, newStatus);
      setIsCompleted(newStatus);
      Alert.alert(
        "Thành công", 
        newStatus ? "Đã đánh dấu hoàn thành" : "Đã hủy đánh dấu hoàn thành"
      );
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật tiến độ. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, isCompleted, lessonId]);

  const handleRetry = useCallback(() => {
    setVideoError(false);
    setRetryCount(0);
  }, []);

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <Text className="text-3xl font-bold text-gray-800 mb-2">{title}</Text>
        <Text className="text-gray-600 text-base mb-6">{description}</Text>
      </View>

      <View className="w-full aspect-video bg-black">
        {videoUrl && !videoError ? (
          <VideoPlayer 
            url={videoUrl} 
            onError={handleVideoError}
          />
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-white mb-4">
              {!videoUrl 
                ? "Không có video" 
                : "Không thể tải video. Vui lòng thử lại."}
            </Text>
            {videoError && (
              <TouchableOpacity 
                onPress={handleRetry}
                className="bg-blue-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white">Thử lại</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <View className="px-4 pb-8 mt-6">
        <TouchableOpacity
          onPress={handleComplete}
          disabled={isLoading || videoError}
          className={`flex-row items-center justify-center p-4 rounded-xl shadow-sm ${
            isCompleted ? "bg-green-600" : "bg-blue-600"
          } ${(isLoading || videoError) ? "opacity-50" : ""}`}
        >
          <Ionicons
            name={isCompleted ? "checkmark-circle" : "radio-button-off"}
            size={24}
            color="white"
          />
          <Text className="text-white font-bold ml-2 text-lg">
            {isLoading 
              ? "Đang xử lý..." 
              : isCompleted 
                ? "Đã hoàn thành" 
                : "Đánh dấu hoàn thành"}
          </Text>
        </TouchableOpacity>

        <View className="mt-8 bg-white p-6 rounded-xl shadow-sm">
          <Text className="text-xl font-bold mb-4 text-gray-800">Ghi chú:</Text>
          <View className="space-y-2">
            <Text className="text-gray-600 text-base leading-relaxed">
              • Xem hết video để nắm rõ nội dung bài học
            </Text>
            <Text className="text-gray-600 text-base leading-relaxed">
              • Hoàn thành bài tập được giao (nếu có)
            </Text>
            <Text className="text-gray-600 text-base leading-relaxed">
              • Đánh dấu hoàn thành khi đã nắm vững kiến thức
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default React.memo(CourseVideo);
