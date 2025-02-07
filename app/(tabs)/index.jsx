import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import CategoryList from "../../components/CategoryList";
import Header from "../../components/Header";
import { useAuthContext } from "../../context/AuthContext";
import { Redirect } from "expo-router";
import axiosInstance from "../../utils/axiosInstance";

export default function HomeScreen() {
  const { authState } = useAuthContext();
  const [categoryData, setCategoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  if (authState.authenticated === false) return <Redirect href={"/login"} />;
  console.log("User data: ", authState.user);
  console.log("Auth state: ", authState.authenticated);

  const fetchCategoryData = async () => {
    try {
      const response = await axiosInstance.get(`/categories`);
      console.log("List Categories:", response.data);
      setCategoryData(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  return (
    <View className="h-full bg-slate-100">
      <Header />
      <View className="flex-row mx-8 mt-5 justify-between items-end">
        <Text className="text-2xl font-psemibold">Explore Categories</Text>
        <Text className="text-base text-blue-600 font-pmedium">See all</Text>
      </View>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ marginTop: 20 }}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <CategoryList data={categoryData} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 100,
    paddingTop: 30,
  },
});
