import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { currencyFormat } from "../../utils";
import { router, useFocusEffect } from "expo-router";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchFavorites = async () => {
    const favorites = await AsyncStorage.getItem("favorites");
    setFavorites(JSON.parse(favorites) || []);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchFavorites();
    }, [])
  );
  const removeFavorite = async (id) => {
    const updatedFavorites = favorites.filter((item) => item.id !== id);
    await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
    setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
  };

  const removeSelectedFavorites = async () => {
    const updatedFavorites = favorites.filter(
      (item) => !selectedItems.includes(item.id)
    );
    await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
    setSelectedItems([]);
    setIsSelectionMode(false);
  };

  const removeAllFavorites = async () => {
    await AsyncStorage.setItem("favorites", JSON.stringify([]));
    setFavorites([]);
    setSelectedItems([]);
    setIsSelectionMode(false);
  };

  const toggleItemSelection = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };
  const handleCoursePress = (courseId) => {
    // Kiểm tra xem khóa học đã được mua chưa
    const isPurchased = courses.some((course) => course._id === courseId);

    if (isPurchased) {
      router.push({
        pathname: "/myCourse/myCourseDetail",
        params: { courseId },
      });
    } else {
      router.push({
        pathname: "/detailCourse/[courseId]",
        params: { courseId },
      });
    }
  };
  const filteredFavorites = favorites.filter((favorite) =>
    favorite.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header Section */}
      <View className="bg-[#4B6EF5] p-6 pb-8 rounded-3xl m-3">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center space-x-2">
            <Text className="text-2xl font-pbold text-white">
              Favorite Courses
            </Text>
            <Ionicons name="heart" size={24} color="white" />
          </View>
        </View>

        {/* Search Bar */}
        <View className="mt-4">
          <View className="flex-row items-center bg-white/20 rounded-xl px-4 py-2">
            <Ionicons name="search" size={20} color="white" />
            <TextInput
              placeholder="Tìm kiếm khóa học..."
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-2 text-white font-psemibold"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View className="">
          {favorites.length > 0 && (
            <View className="flex-row justify-end space-x-2 mt-4 gap-2">
              <TouchableOpacity
                onPress={() => setIsSelectionMode(!isSelectionMode)}
                className="bg-white/20 px-4 rounded-xl flex-row items-center space-x-2"
              >
                <Ionicons
                  name={isSelectionMode ? "close" : "checkbox-outline"}
                  size={20}
                  color="white"
                />
                <Text className="text-white font-psemibold">
                  {isSelectionMode ? "Hủy" : "Chọn"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={removeAllFavorites}
                className="bg-white/20 px-4 py-2 rounded-xl flex-row items-center space-x-2"
              >
                <Ionicons name="trash-outline" size={20} color="white" />
                <Text className="text-white font-psemibold">Xóa tất cả</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Selection Mode Banner */}
      {isSelectionMode && selectedItems.length > 0 && (
        <View className="bg-red-500 p-3 mx-4 rounded-md">
          <TouchableOpacity
            onPress={removeSelectedFavorites}
            className="flex-row items-center justify-center"
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color="white"
              className="mr-2"
            />
            <Text className="text-white text-center font-medium">
              Xóa {selectedItems.length} khóa học đã chọn
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Content Section */}
      <ScrollView className="flex-1 p-4">
        {filteredFavorites.length === 0 ? (
          <View className="flex-1 justify-center items-center py-12">
            {searchQuery ? (
              <>
                <Ionicons name="search-outline" size={80} color="#CBD5E1" />
                <Text className="text-xl font-semibold text-gray-400 mt-4">
                  Không tìm thấy kết quả
                </Text>
                <Text className="text-gray-400 text-center mt-2">
                  Hãy thử tìm kiếm với từ khóa khác
                </Text>
              </>
            ) : (
              <>
                <Ionicons name="heart-outline" size={80} color="#CBD5E1" />
                <Text className="text-xl font-semibold text-gray-400 mt-4">
                  Chưa có khóa học yêu thích
                </Text>
                <Text className="text-gray-400 text-center mt-2">
                  Bạn có thể thêm khóa học yêu thích từ danh sách khóa học
                </Text>
                <TouchableOpacity
                  onPress={handleCoursePress}
                  className="bg-blue-500 px-6 py-3 rounded-xl mt-4"
                >
                  <Text className="text-white font-semibold">Xem khóa học</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        ) : (
          <View className="space-y-4">
            {filteredFavorites.map((favorite) => (
              <TouchableOpacity
                key={favorite.id}
                onPress={() => router.push(`/detailCourse/${favorite.id}`)}
                className="bg-white rounded-xl overflow-hidden shadow-sm"
              >
                <View className="flex-row items-center p-4">
                  {isSelectionMode && (
                    <TouchableOpacity
                      onPress={() => toggleItemSelection(favorite.id)}
                      className="mr-3"
                    >
                      <AntDesign
                        name={
                          selectedItems.includes(favorite.id)
                            ? "checkcircle"
                            : "checkcircleo"
                        }
                        size={24}
                        color="#4B6EF5"
                      />
                    </TouchableOpacity>
                  )}
                  <Image
                    source={{ uri: favorite.image }}
                    className="w-20 h-20 rounded-lg"
                  />
                  <View className="flex-1 ml-4">
                    <Text className="font-semibold text-base text-gray-800">
                      {favorite.title}
                    </Text>
                    <Text className="text-blue-500 font-medium mt-1">
                      {currencyFormat.format(favorite.price)}
                    </Text>
                  </View>
                  {!isSelectionMode && (
                    <TouchableOpacity
                      onPress={() => removeFavorite(favorite.id)}
                      className="p-2"
                    >
                      <AntDesign name="heart" size={24} color="#4B6EF5" />
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
