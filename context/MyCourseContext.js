import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useAuthContext } from "./AuthContext";

const BASE_URL = "https://mma301-backend.onrender.com/api";

const MyCourseContext = createContext({});
export const useMyCourseContext = () => useContext(MyCourseContext);

export const MyCourseProvider = ({ children }) => {
  const { authState } = useAuthContext();
  const [courses, setCourses] = useState([]);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [categories, setCategories] = useState([]);
  
  // Tạo axios instance với token
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
      'Authorization': `Bearer ${authState?.token}`,
      'Content-Type': 'application/json'
    }
  });

  // Hàm retry với delay tăng dần
  const retryRequest = async (fn, retries = 3, delay = 1000) => {
    try {
      return await fn();
    } catch (error) {
      if (retries === 0) throw error;
      console.log(`Thử lại lần ${4 - retries}, chờ ${delay/1000}s...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryRequest(fn, retries - 1, delay * 2);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await retryRequest(() => axiosInstance.get('/categories'));
      setCategories(res.data);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error.message);
      setCategories([]);
    }
  };

  const fetchMyCourses = async () => {
    try {
      const res = await retryRequest(() => axiosInstance.get('/courses?search'));
      const coursesData = res.data.data || [];
      setCourses(coursesData);
      return coursesData;
    } catch (error) {
      console.error("Lỗi khi tải khóa học:", error.message);
      setCourses([]);
    }
  };

  const fetchCourseDetail = async (courseId) => {
    try {
      const res = await retryRequest(() => axiosInstance.get(`/courses/${courseId}`));
      const courseData = Array.isArray(res.data) ? res.data[0] : res.data;
      setCurrentCourse(courseData);
      return courseData;
    } catch (error) {
      console.error("Lỗi khi tải chi tiết khóa học:", error.message);
      setCurrentCourse(null);
    }
  };

  // Thêm xử lý token cho Firebase Storage nếu cần
  const getFirebaseStorageToken = async () => {
    try {
      // Thêm logic lấy token từ Firebase nếu cần
      return null;
    } catch (error) {
      console.error("Lỗi lấy token:", error);
      return null;
    }
  };

  const getVideoAccessUrl = async (videoUrl) => {
    try {
      if (!videoUrl) return null;

      // Nếu là Firebase URL, trả về trực tiếp
      if (videoUrl.includes('firebase')) {
        return videoUrl; // Trả về URL Firebase trực tiếp
      }

      return videoUrl;
    } catch (error) {
      console.error("Lỗi xử lý video:", error.message);
      return null;
    }
  };

  const updateLessonProgress = async (lessonId, isCompleted) => {
    try {
      if (!lessonId) throw new Error("Thiếu lessonId");

      const response = await axiosInstance.post(`/lessons/${lessonId}/progress`, {
        isCompleted
      });

      return response.data;
    } catch (error) {
      console.error("Lỗi cập nhật tiến độ:", error.message);
      throw error;
    }
  };

  const value = {
    courses,
    currentCourse,
    categories,
    fetchMyCourses,
    fetchCourseDetail,
    fetchCategories,
    updateLessonProgress,
    getFirebaseStorageToken,
    getVideoAccessUrl,
  };

  return (
    <MyCourseContext.Provider value={value}>{children}</MyCourseContext.Provider>
  );
};
