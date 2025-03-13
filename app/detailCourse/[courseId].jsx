import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import axiosInstance from "../../utils/axiosInstance";
import { currencyFormat } from "../../utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CourseDetailScreen = () => {
  const router = useRouter();
  const { courseId } = useLocalSearchParams();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [countLesson, setCountLesson] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchCourseDetails = async () => {
    try {
      const response = await axiosInstance.get(`/courses/${courseId}`);
      setCourse(response.data);
      console.log("Detail Course", response.data);
    } catch (err) {
      console.error("Error fetching course details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChapter = (chapterId) => {
    setExpandedChapter(expandedChapter === chapterId ? null : chapterId);
  };

  let count = 0;
  useEffect(() => {
    if (courseId) fetchCourseDetails();
    course?.chapters.forEach((chapter) => {
      count += chapter?.lessons.length;
    });
    setCountLesson(count);
  }, [courseId]);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const existingFavorites = await AsyncStorage.getItem("favorites");
        if (existingFavorites) {
          const favorites = JSON.parse(existingFavorites);
          const isFav = favorites.some((item) => item.id === courseId);
          setIsFavorite(isFav);
        }
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };
    checkFavoriteStatus();
  }, [courseId]);

  const handleFavorite = async () => {
    try {
      const existingFavorites =
        (await AsyncStorage.getItem("favorites")) || "[]";
      const favorites = JSON.parse(existingFavorites);

      const isFavorite = favorites.some((item) => item.id === courseId);

      if (isFavorite) {
        const updatedFavorites = favorites.filter(
          (item) => item.id !== courseId
        );
        await AsyncStorage.setItem(
          "favorites",
          JSON.stringify(updatedFavorites)
        );
      } else {
        favorites.push({
          id: courseId,
          title: course.title,
          price: course.price,
          image: course.thumbnailUrl,
        });
        await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B6EF5" />
        <Text className="text-blue-500">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="h-screen flex-1 bg-slate-100">
      <ScrollView>
        <View className="h-screen w-full flex justify-start items-center">
          {/* Image Section */}
          <Image
            source={
              course.thumbnailUrl
                ? { uri: course.thumbnailUrl }
                : require("../../assets/images/logo-music-1.png")
            }
            style={{ width: "100%", height: 360 }}
            resizeMode="contain"
          />

          {/* Content Section */}
          <View className="flex-col items-start mt-4 px-10 w-full">
            {/* Course Title */}
            <Text className="text-5xl text-start font-pbold py-2">
              {course.title}
            </Text>
            <Text className="text-base text-slate-400 text-start font-psemibold mb-5 py-2">
              Category: {course.category}
            </Text>
            {/* Description and Price */}
            <View className="flex flex-row justify-between items-start w-full space-x-4">
              <View className="flex-1">
                <Text className="text-lg font-pbold mb-2">
                  About the course
                </Text>
                <Text className="text-gray-600 leading-relaxed font-pmedium">
                  {course.description}
                </Text>
              </View>
              <View className="flex flex-col items-end flex-1">
                <Text className="text-4xl font-pbold text-blue-600 mb-2">
                  {currencyFormat.format(course.price)}
                </Text>
                <Text className="text-sm text-gray-500">
                  Lessons: {countLesson}
                </Text>
              </View>
            </View>

            {/* Chapters and Lessons Section */}
            <View className="w-full mt-8">
              <Text className="text-2xl font-pbold mb-4">Course Content</Text>
              {course.chapters?.map((chapter) => (
                <View key={chapter._id} className="mb-4">
                  <TouchableOpacity
                    onPress={() => toggleChapter(chapter._id)}
                    className="flex-row justify-between items-center bg-white p-4 rounded-xl border border-gray-200"
                  >
                    <View className="flex-row items-center">
                      <AntDesign
                        name={
                          expandedChapter === chapter._id ? "down" : "right"
                        }
                        size={20}
                        color="#4B6EF5"
                      />
                      <Text className="text-lg font-psemibold ml-2">
                        {chapter.title}
                      </Text>
                    </View>
                    <Text className="text-slate-400">
                      {chapter.lessons?.length || 0} lessons
                    </Text>
                  </TouchableOpacity>

                  {expandedChapter === chapter._id && (
                    <View className="ml-6 mt-2">
                      {chapter.lessons?.map((lesson) => (
                        <View
                          key={lesson._id}
                          className="flex-row items-center bg-white p-3 rounded-lg border border-gray-100 mb-2"
                        >
                          <AntDesign
                            name="playcircleo"
                            size={18}
                            color="#4B6EF5"
                          />
                          <Text className="ml-2 font-pmedium text-base text-slate-400">
                            {lesson.title}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="absolute bottom-0 w-full bg-white border-t border-gray-200 py-4 px-6">
        <View className="flex flex-row items-center justify-between">
          <View className="w-1/5 flex items-center">
            <TouchableOpacity onPress={handleFavorite}>
              <AntDesign
                name={isFavorite ? "heart" : "hearto"}
                size={24}
                color={"#4B6EF5"}
              />
            </TouchableOpacity>
          </View>
          <View className="ml-2 w-4/5">
            <TouchableOpacity
              className="bg-[#4B6EF5] py-4 rounded-full"
              onPress={() =>
                router.push({
                  pathname: "/checkout/payment",
                  params: { courseId },
                })
              }
            >
              <Text className="text-white text-center font-bold text-lg">
                Buy now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CourseDetailScreen;

const styles = StyleSheet.create({
  dropdown: {
    width: "100%",
    paddingLeft: 10,
    margin: 16,
    height: 50,
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
