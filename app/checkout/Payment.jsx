import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Linking, Modal } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axiosInstance from "../../utils/axiosInstance";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";

const CheckoutScreen = () => {
  const router = useRouter();
  const { courseId } = useLocalSearchParams();
  const [course, setCourse] = useState(null);
  // const [promotions, setPromotions] = useState([]); // Comment lại phần gọi API promotions
  const [selectedPromotion, setSelectedPromotion] = useState("none");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  // Dữ liệu tĩnh thay thế cho API promotions
  const promotions = [
    { _id: "promo1", title: "Giảm 10%" },
    { _id: "promo2", title: "Giảm 20%" },
    { _id: "promo3", title: "Mua 1 tặng 1" }
  ];

  const fetchCourseDetails = async () => {
    try {
      const response = await axiosInstance.get(`/courses/${courseId}`);
      if (response.data.length > 0) {
        setCourse(response.data[0]); // Lấy object đầu tiên trong mảng
      } else {
        setError("Không tìm thấy khóa học.");
      }
    } catch (err) {
      setError(`Lỗi khi tải khóa học: ${err.message}`);
      console.error("Error fetching course details:", err);
    } finally {
      setIsLoading(false); // Đảm bảo cập nhật isLoading
    }
  };
  
  const handleEnrollment = async () => {
    try {
      const response = await axiosInstance.post("/enrollments", {
        courseId,
        promotionId: selectedPromotion !== "none" ? selectedPromotion : null,
      });
      console.log("Enrollment response:", response.data);
      const { paymentUrl } = response.data;
      if (paymentUrl) {
        Linking.openURL(paymentUrl); // Redirect to Vnpay payment page
        setIsPaymentSuccess(true);
      } else {
        alert("You have already purchased this course.");
      }
    } catch (err) {
      console.error("Error during enrollment:", err);
      alert("Enrollment failed. Please try again.");
    }
  };
  
  // const handlePromotionChange = (promotionId) => {
  //   setSelectedPromotion(promotionId);
  // };

  useEffect(() => {
    console.log('courseId:', courseId);
    if (courseId) {
      setIsLoading(true);
      setError(null);
      fetchCourseDetails().then(() => {
        setIsLoading(false);
      });
    }
  }, [courseId]);
  
  

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B6EF5" />
        <Text>Đang tải khóa học...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Xác nhận Thanh Toán</Text>
      
      <Image 
        source={{ uri: course?.thumbnailUrl || "https://via.placeholder.com/200" }}
        style={styles.image}
      />
      
      <Text style={styles.title}>{course?.title || "Không có tiêu đề"}</Text>
      <Text style={styles.price}>Giá: ${course?.price || "N/A"}</Text>
      
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Chọn khuyến mãi:</Text>
        <Picker
          selectedValue={selectedPromotion}
          onValueChange={(itemValue) => setSelectedPromotion(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Không có khuyến mãi" value="none" />
          {promotions.map((promotion) => (
            <Picker.Item key={promotion._id} label={promotion.title} value={promotion._id} />
          ))}
        </Picker>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleEnrollment}>
        <Text style={styles.buttonText}>Thanh toán ngay</Text>
      </TouchableOpacity>

      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={isPaymentSuccess}
        onRequestClose={() => setIsPaymentSuccess(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Thanh toán thành công!</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsPaymentSuccess(false)}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f0f0f0", padding: 20 },
  header: { fontSize: 26, fontWeight: "bold", marginBottom: 20, color: "#333" },
  image: { width: 200, height: 200, marginBottom: 20, borderRadius: 10, elevation: 5 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, color: "#333" },
  price: { fontSize: 20, color: "#4B6EF5", marginBottom: 20 },
  dropdownContainer: { width: "100%", marginBottom: 20, paddingHorizontal: 10 },
  label: { fontSize: 16, marginBottom: 5, color: "#333" },
  picker: { backgroundColor: "white", borderRadius: 5, borderColor: "#ccc", borderWidth: 1 },
  button: { backgroundColor: "#4B6EF5", padding: 15, borderRadius: 10, width: "80%", alignItems: "center", elevation: 5 },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  errorText: { color: "red", fontSize: 18, textAlign: "center" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { width: 300, padding: 20, backgroundColor: "white", borderRadius: 10, alignItems: "center" },
  modalText: { fontSize: 18, marginBottom: 20 },
  closeButton: { backgroundColor: "#4B6EF5", padding: 10, borderRadius: 5 },
  closeButtonText: { color: "white", fontSize: 16 },
});


export default CheckoutScreen;
