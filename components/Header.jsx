import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuthContext } from "../context/AuthContext";
import SearchInput from "./SearchInput";

export default function Header({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { authState } = useAuthContext();

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (onSearch) {
      onSearch(text);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <View className="bg-[#4B6EF5] p-6 rounded-3xl m-3">
      <View className="flex-row justify-between items-center mb-5">
        <View>
          <Text className="text-2xl font-pbold text-white">
            Hello, {authState.user.email}
          </Text>
          <Text className="text-base font-pmedium text-white mt-1">
            Welcome
          </Text>
        </View>
        <TouchableOpacity className="relative bg-white/20 rounded-full p-2">
          <Ionicons name="notifications-outline" size={24} color="#fff" />
          <View className="absolute top-1 right-1 w-2 h-2 bg-[#FF4D4F] rounded-full" />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center bg-white rounded-2xl py-3 px-3">
        <View className="flex-row items-center flex-1">
          <Ionicons name="search" size={20} color="#aaa" className="mr-2" />
          <TextInput
            className="flex-1 text-base text-gray-800"
            placeholder="Search"
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} className="mr-2">
              <Ionicons name="close-circle" size={20} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
