import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function SearchInput({ onSearch, otherStyles }) {
  const [searchQuery, setSearchQuery] = useState("");

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
    <View
      className={`flex-row items-center bg-white rounded-2xl py-2 px-3 ${otherStyles}`}
    >
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
  );
}
