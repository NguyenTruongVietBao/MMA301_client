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
  const [isLoading, setIsLoading] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);

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

  // Helper function to count videos in a course
  const countVideosInCourse = (courseData) => {
    let videoCount = 0;
    
    // Check for chapters structure
    if (courseData.chapters && Array.isArray(courseData.chapters)) {
      courseData.chapters.forEach(chapter => {
        if (chapter.lessons && Array.isArray(chapter.lessons)) {
          chapter.lessons.forEach(lesson => {
            if (lesson.videoUrl) videoCount++;
          });
        }
      });
    }
    
    // Check if the course has direct lessons array (alternative structure)
    if (courseData.lessons && Array.isArray(courseData.lessons)) {
      courseData.lessons.forEach(lesson => {
        if (lesson.videoUrl) videoCount++;
      });
    }
    
    return videoCount;
  };

  // ✅ Lấy danh sách khóa học của user
  const fetchMyCourses = async () => {
    if (isLoading) return; // Tránh gọi API nếu đang loading
    setIsLoading(true);
    try {
      const res = await retryRequest(() => getAxiosInstance().get("/courses/my-courses/purchased"));
      
      // Process each course to get detailed information including videos
      const coursesWithDetails = await Promise.all((res.data || []).map(async (course) => {
        try {
          // Get detailed course information for each course
          const detailRes = await retryRequest(() => 
            getAxiosInstance().get(`/courses/${course._id}`)
          );
          
          const courseDetail = Array.isArray(detailRes.data) ? detailRes.data[0] : detailRes.data;
          
          // Count videos in the course
          const videoCount = countVideosInCourse(courseDetail);
          
          // Return course with the video count
          return { 
            ...course, 
            videoCount,
            // If the course from list doesn't have chapters but detail does, use those
            chapters: course.chapters || courseDetail.chapters
          };
        } catch (error) {
          console.error(`Error getting details for course ${course._id}:`, error.message);
          return { ...course, videoCount: 0 };
        }
      }));
      
      setCourses(coursesWithDetails);
      return coursesWithDetails;
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
      
      // Count videos in the course
      const videoCount = countVideosInCourse(courseData);
      
      const enhancedCourseData = { ...courseData, videoCount };
      setCurrentCourse(enhancedCourseData);
      return enhancedCourseData;
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

      const response = await axios.post(
        `${BASE_URL}/lessons/completed/${lessonId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          }
        }
      );

      // Kiểm tra response và cập nhật state ngay lập tức
      if (response.data) {
        setCompletedLessons(prev => {
          // Kiểm tra nếu lessonId chưa tồn tại thì mới thêm vào
          if (!prev.includes(lessonId)) {
            return [...prev, lessonId];
          }
          return prev;
        });
        return { success: true, message: "Cập nhật thành công" };
      }

      return { success: false, message: response.data.message };
    } catch (error) {
      console.error("Chi tiết lỗi:", error);
      throw error;
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

      const completed = response.data || [];
      console.log('Fetched completed lessons:', completed);
      setCompletedLessons(completed);
      return completed;
    } catch (error) {
      console.error("Lỗi lấy danh sách hoàn thành:", error);
      return [];
    }
  };

  // Thêm hàm refreshCompletedLessons
  const refreshCompletedLessons = async () => {
    try {
      const completed = await getCompletedLessons();
      setCompletedLessons(completed);
      return completed;
    } catch (error) {
      console.error("Lỗi refresh completed lessons:", error);
      throw error;
    }
  };

  // Cập nhật hàm isLessonCompleted để sử dụng state
  const isLessonCompleted = (lessonId) => {
    return completedLessons.includes(lessonId);
  };

  // Thêm useEffect để load completed lessons khi component mount
  useEffect(() => {
    getCompletedLessons();
  }, []);

  // ✅ Trả về context value
  const value = {
    courses,
    currentCourse,
    categories,
    isLoading,
    completedLessons,
    setCompletedLessons,
    fetchMyCourses,
    fetchCourseDetail,
    fetchCategories,
    updateLessonProgress,
    getVideoAccessUrl,
    isLessonCompleted,
    getCompletedLessons,
    refreshCompletedLessons
  };

  return <MyCourseContext.Provider value={value}>{children}</MyCourseContext.Provider>;
};
