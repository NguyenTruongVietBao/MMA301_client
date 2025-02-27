import React, { useState, useCallback, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Dimensions, BackHandler } from "react-native";
import { Video, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useMyCourseContext } from "../../context/MyCourseContext";
import { useAuthContext } from "../../context/AuthContext";
import * as ScreenOrientation from 'expo-screen-orientation';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import axiosInstance from "../../utils/axiosInstance";
import { WebView } from 'react-native-webview';
import { Audio } from 'expo-av';

const VideoPlayer = React.memo(({ videoUrl }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [orientation, setOrientation] = useState(1); // 1 for portrait, 2 for landscape
  const video = useRef(null);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const videoHeight = orientation === 1 ? screenWidth * (9/16) : screenHeight;
  const videoWidth = orientation === 1 ? screenWidth : screenWidth;

  // Cấu hình âm thanh khi component mount
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false
        });
        console.log("Audio mode set successfully");
      } catch (error) {
        console.error("Error setting audio mode:", error);
      }
    };

    setupAudio();
  }, []);

  // Xử lý xoay màn hình
  useEffect(() => {
    const subscription = ScreenOrientation.addOrientationChangeListener((event) => {
      setOrientation(event.orientationInfo.orientation);
    });

    return () => {
      subscription.remove();
      // Reset về portrait khi unmount
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };
  }, []);

  // Cho phép xoay màn hình tự do
  useEffect(() => {
    ScreenOrientation.unlockAsync();
  }, []);

  const processVideoUrl = (url) => {
    try {
      return url.replace(/\/videos\//g, '/videos%2F');
    } catch (error) {
      console.error("Error processing URL:", error);
      return url;
    }
  };

  const onPlaybackStatusUpdate = async (status) => {
    if (status.isLoaded) {
      if (isLoading) {
        setIsLoading(false);
      }
      
      // Theo dõi trạng thái buffering
      setIsBuffering(status.isBuffering);
      
      if (status.didJustFinish) {
        setIsFinished(true);
      }
    }
  };

  // Hàm xử lý xem lại video
  const handleReplay = async () => {
    if (video.current) {
      setIsFinished(false);
      await video.current.replayAsync();
    }
  };

  const finalVideoUrl = processVideoUrl(videoUrl);
  console.log("Final video URL:", finalVideoUrl);

  return (
    <View style={{ 
      width: videoWidth, 
      height: videoHeight,
      backgroundColor: 'black',
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {(isLoading || isBuffering) && (
        <View style={{
          position: 'absolute',
          zIndex: 1,
          alignItems: 'center'
        }}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: 'white', marginTop: 10 }}>
            {isLoading ? 'Loading video...' : 'Buffering...'}
          </Text>
        </View>
      )}
      
      <Video
        ref={video}
        style={{
          width: '100%',
          height: '100%'
        }}
        source={{
          uri: finalVideoUrl,
          overrideFileExtensionAndroid: 'mp4'
        }}
        useNativeControls
        resizeMode="contain"
        isLooping={false}
        shouldPlay={false}
        volume={1.0}
        isMuted={false}
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        onLoadStart={() => {
          setIsLoading(true);
          setIsBuffering(false);
        }}
        onLoad={async (status) => {
          setIsLoading(false);
          console.log("Video loaded successfully", status);
          if (video.current) {
            try {
              await video.current.setVolumeAsync(1.0);
              await video.current.setIsMutedAsync(false);
            } catch (error) {
              console.error("Error setting initial audio:", error);
            }
          }
        }}
        onError={(error) => {
          console.error("Video error:", {
            error,
            url: finalVideoUrl
          });
          setIsLoading(false);
        }}
      />

      {/* Nút xem lại với animation */}
      {isFinished && (
        <TouchableOpacity
          onPress={handleReplay}
          style={{
            position: 'absolute',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: 15,
            borderRadius: 50,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            transform: [{ scale: 1 }], // Thêm animation scale khi xuất hiện
          }}
        >
          <Ionicons name="reload" size={24} color="white" />
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '500' }}>
            Xem lại
          </Text>
        </TouchableOpacity>
      )}
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

  console.log("Video URL from params:", videoUrl); // Debug log to see the URL

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