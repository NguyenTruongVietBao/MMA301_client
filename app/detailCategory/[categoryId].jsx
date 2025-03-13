import { View, Text, ActivityIndicator, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import CourseList from "../../components/CourseList";
import axiosInstance from "../../utils/axiosInstance";
import SearchInput from "../../components/SearchInput";
import { useMyCourseContext } from "../../context/MyCourseContext";

export default function Index() {
  const { categoryId } = useLocalSearchParams();
  const router = useRouter();
  const { courses } = useMyCourseContext();
  const [coursesList, setCoursesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredCourses(coursesList);
      return;
    }
    const filtered = coursesList.filter((course) =>
      course.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/courses/category/${categoryId}`
      );
      setCoursesList(response.data?.data || []);
      setFilteredCourses(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchCourses();
    }
  }, [categoryId]);

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

  return (
    <View className="bg-slate-100 h-full">
      <Text className="text-3xl font-psemibold m-5 ml-6">Courses</Text>
      <View className="mx-5 mb-5">
        <SearchInput
          onSearch={handleSearch}
          otherStyles={"border-2 border-blue-500 mx-2"}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ marginTop: 20 }}
        />
      ) : filteredCourses.length > 0 ? (
        <>
          <Text className="text-xl font-psemibold mx-8">Result:</Text>
          <CourseList
            data={filteredCourses}
            onCoursePress={handleCoursePress}
          />
        </>
      ) : (
        <Text className="text-center text-lg mt-10">No courses found</Text>
      )}
    </View>
  );
}
