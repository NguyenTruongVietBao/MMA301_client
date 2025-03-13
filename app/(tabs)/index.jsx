import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, ActivityIndicator } from "react-native";
import CategoryList from "../../components/CategoryList";
import Header from "../../components/Header";
import { useAuthContext } from "../../context/AuthContext";
import { Redirect } from "expo-router";
import axiosInstance from "../../utils/axiosInstance";

export default function HomeScreen() {
  const { authState } = useAuthContext();
  const [categoryData, setCategoryData] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  if (authState.authenticated === false) return <Redirect href={"/login"} />;

  const fetchCategoryData = async () => {
    try {
      const response = await axiosInstance.get(`/categories`);
      console.log("List Categories:", response.data);
      setCategoryData(response.data);
      setFilteredCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredCategories(categoryData);
      return;
    }
    const filtered = categoryData.filter((category) =>
      category.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  return (
    <View className="h-full bg-slate-100">
      <Header onSearch={handleSearch} />
      <View className="flex-row mx-9 mt-10 justify-between items-end">
        <Text className="text-3xl font-psemibold">Explore Categories</Text>
        <Text className="text-base text-blue-600 font-pmedium">More</Text>
      </View>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ marginTop: 10 }}
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} className="mt-5">
          <CategoryList data={filteredCategories} />
        </ScrollView>
      )}
    </View>
  );
}
