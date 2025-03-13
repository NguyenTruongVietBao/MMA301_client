import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useMyCourseContext } from "../../context/MyCourseContext";
import { useAuthContext } from "../../context/AuthContext";
import * as ScreenOrientation from "expo-screen-orientation";

import { Audio } from "expo-av";

const VideoPlayer = React.memo(({ videoUrl }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [orientation, setOrientation] = useState(1); // 1 for portrait, 2 for landscape
  const video = useRef(null);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const videoHeight = orientation === 1 ? screenWidth * (9 / 16) : screenHeight;
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
          playThroughEarpieceAndroid: false,
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
    const subscription = ScreenOrientation.addOrientationChangeListener(
      (event) => {
        setOrientation(event.orientationInfo.orientation);
      }
    );

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
      return url.replace(/\/videos\//g, "/videos%2F");
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
    <View
      style={{
        width: videoWidth,
        height: videoHeight,
        backgroundColor: "black",
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {(isLoading || isBuffering) && (
        <View
          style={{
            position: "absolute",
            zIndex: 1,
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: "white", marginTop: 10 }}>
            {isLoading ? "Loading video..." : "Buffering..."}
          </Text>
        </View>
      )}

      <Video
        ref={video}
        style={{
          width: "100%",
          height: "100%",
        }}
        source={{
          uri: finalVideoUrl,
          overrideFileExtensionAndroid: "mp4",
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
            url: finalVideoUrl,
          });
          setIsLoading(false);
        }}
      />

      {/* Nút xem lại với animation */}
      {isFinished && (
        <TouchableOpacity
          onPress={handleReplay}
          style={{
            position: "absolute",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            padding: 15,
            borderRadius: 50,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            transform: [{ scale: 1 }], // Thêm animation scale khi xuất hiện
          }}
        >
          <Ionicons name="reload" size={24} color="white" />
          <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>
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
    author,
  } = params;
  const {
    updateLessonProgress,
    completedLessons,
    setCompletedLessons,
    getCompletedLessons,
  } = useMyCourseContext();
  const { authState } = useAuthContext();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  // Đơn giản hóa việc kiểm tra trạng thái hoàn thành
  const isCompleted = completedLessons.includes(lessonId);

  // Thêm state để quản lý việc refresh UI
  const [refreshKey, setRefreshKey] = useState(0);

  // Thêm ref cho ScrollView
  const scrollViewRef = useRef(null);

  const handleComplete = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await updateLessonProgress(lessonId);
      if (result.success) {
        Alert.alert("Thành công", "Đã cập nhật tiến độ bài học!");
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      if (error.response?.status === 401) {
        Alert.alert("Phiên đăng nhập hết hạn", "Vui lòng đăng nhập lại");
      } else {
        Alert.alert("Lỗi", "Không thể cập nhật tiến độ. Vui lòng thử lại sau.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, lessonId]);

  // Format date
  const formatDate = (dateString) => {
    try {
      if (!dateString) return "No data";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "No data";
      return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
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
          headerStyle: { backgroundColor: "white" },
        }}
      />

      <ScrollView
        ref={scrollViewRef}
        key={refreshKey}
        className="flex-1 bg-white"
      >
        <View className="bg-black">
          <VideoPlayer videoUrl={videoUrl} />
        </View>

        <View className="p-5">
          <TouchableOpacity
            onPress={handleComplete}
            disabled={isLoading}
            className={`p-4 rounded-xl flex-row items-center justify-center ${
              isCompleted ? "bg-[#4ade80]" : "bg-[#3b82f6]"
            }`}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons
                  name={isCompleted ? "checkmark-circle" : "bookmark-outline"}
                  size={24}
                  color="white"
                />
                <Text className="text-white font-semibold text-lg ml-2">
                  {isCompleted ? "Completed" : "Mark as Complete"}
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
            <Text className="text-gray-600 mb-2">
              • Watch the entire video to understand the lesson content
            </Text>
            <Text className="text-gray-600 mb-2">
              • Complete assigned exercises (if any)
            </Text>
            <Text className="text-gray-600">
              • Mark as complete when you've mastered the material
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default CourseVideo;
