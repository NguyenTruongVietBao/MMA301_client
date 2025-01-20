import { Link, router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { UserContext } from "../../context/UserContext";
import { useContext, useEffect, useState } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import CategoryCard from "../../components/CategoryCard";
import sampleDataCourse from "../../constants/courses";
import CategoryList from "../../components/CategoryList";
import Header from "../../components/Header";

export default function HomeScreen() {
  const { user } = useContext(UserContext);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    if (isMounted && !user) {
      router.push("/(auth)/login");
    }
  }, [isMounted, user]);

  return (
    <View className="h-full bg-slate-100">
      <Header />

      <View className="flex-row mx-8 my-5 justify-between items-end">
        <Text className="text-2xl font-psemibold">Explore Categories</Text>
        <Text className="text-base text-blue-600 font-pmedium">See all</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <CategoryList data={sampleDataCourse.categories} />
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 100,
    paddingTop: 30, // Ensures enough padding at the bottom
  },
});
