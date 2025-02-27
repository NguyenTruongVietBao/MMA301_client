import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "./AuthContext";
import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://mma301-backend.onrender.com/api";

const MyCourseContext = createContext({});
export const useMyCourseContext = () => useContext(MyCourseContext);

// Cấu hình Firebase (thêm vào đầu file)
const firebaseConfig = {
  // Thêm cấu hình Firebase của bạn vào đây
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const MyCourseProvider = ({ children }) => {
  const { authState } = useAuthContext();
  const [courses, setCourses] = useState([]);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // ✅ Thêm trạng thái loading

  // ✅ Tạo một axios instance mới mỗi lần gọi API để luôn lấy token mới nhất
  const getAxiosInstance = () => {
    return axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${authState?.user?.access_token}`,
        "Content-Type": "application/json",
      },
    });
  };

  // ✅ Hàm retry request với delay tăng dần
  const retryRequest = async (fn, retries = 3, delay = 1000) => {
    try {
      if (!authState?.user?.access_token) {
        throw new Error("Không có token xác thực");
      }
      return await fn();
    } catch (error) {
      if (retries === 0) throw error;
      console.log(`Thử lại lần ${4 - retries}, chờ ${delay / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryRequest(fn, retries - 1, delay * 2);
    }
  };

  // ✅ Lấy danh mục khóa học
  const fetchCategories = async () => {
    try {
      const res = await retryRequest(() => getAxiosInstance().get("/categories"));
      setCategories(res.data);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error.message);
      setCategories([]);
    }
  };

  // ✅ Lấy danh sách khóa học của user
  const fetchMyCourses = async () => {
    if (isLoading || courses.length > 0) return; // Tránh gọi API nếu đã có dữ liệu
    setIsLoading(true);
    try {
      const res = await retryRequest(() => getAxiosInstance().get("/courses/my-courses/purchased"));
      setCourses(res.data || []);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi tải khóa học:", error.message);
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Lấy chi tiết một khóa học
  const fetchCourseDetail = async (courseId) => {
    try {
      const res = await retryRequest(() => getAxiosInstance().get(`/courses/${courseId}`));
      const courseData = Array.isArray(res.data) ? res.data[0] : res.data;
      setCurrentCourse(courseData);
      return courseData;
    } catch (error) {
      console.error("Lỗi khi tải chi tiết khóa học:", error.message);
      setCurrentCourse(null);
    }
  };

  // ✅ Xử lý URL video từ Firebase Storage
  const getVideoAccessUrl = async (videoUrl) => {
    if (!videoUrl) return null;

    try {
      // Lấy path từ URL Firebase Storage
      const url = new URL(videoUrl);
      const pathFromUrl = decodeURIComponent(url.pathname.split(/\//g, '%2F')[1]);
      
      // Tạo reference và lấy download URL
      const videoRef = ref(storage, pathFromUrl);
      const downloadUrl = await getDownloadURL(videoRef);
      
      return downloadUrl;
    } catch (error) {
      console.error("Lỗi xử lý video URL:", error);
      throw error;
    }
  };

  // ✅ Cập nhật tiến độ bài học
  const updateLessonProgress = async (lessonId) => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (!userData) throw new Error("Chưa đăng nhập");

      const { access_token } = JSON.parse(userData);
      if (!access_token) throw new Error("Token không hợp lệ");

      console.log("Đang cập nhật lesson:", lessonId); // Debug log

      const response = await axios.post(
        `${BASE_URL}/lessons/completed/${lessonId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          }
        }
      );

      console.log("Response từ server:", response.data); // Debug log

      return {
        success: response.data.errorCode === 1,
        message: response.data.message
      };
    } catch (error) {
      console.error("Chi tiết lỗi:", {
        message: error.message,
        response: error.response?.data
      });
      throw new Error(error.response?.data?.message || "Không thể cập nhật tiến độ");
    }
  };

  // Lấy danh sách bài học đã hoàn thành
  const getCompletedLessons = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (!userData) return [];

      const { access_token } = JSON.parse(userData);
      if (!access_token) return [];

      const response = await axios.get(
        `${BASE_URL}/lessons/completed`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          }
        }
      );

      console.log("Completed lessons:", response.data); // Debug log
      return response.data || [];
    } catch (error) {
      console.error("Lỗi lấy danh sách hoàn thành:", error);
      return [];
    }
  };

  // Kiểm tra một bài học đã hoàn thành chưa
  const isLessonCompleted = async (lessonId) => {
    try {
      const completedLessons = await getCompletedLessons();
      return completedLessons.includes(lessonId);
    } catch (error) {
      console.error("Lỗi kiểm tra trạng thái hoàn thành:", error);
      return false;
    }
  };

  // ✅ Trả về context value
  const value = {
    courses,
    currentCourse,
    categories,
    isLoading, // ✅ Trả về trạng thái loading
    fetchMyCourses,
    fetchCourseDetail,
    fetchCategories,
    updateLessonProgress,
    getVideoAccessUrl,
    isLessonCompleted,
    getCompletedLessons
  };

  return <MyCourseContext.Provider value={value}>{children}</MyCourseContext.Provider>;
};
