import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axiosInstance from "../../utils/axiosInstance";
import { useLocalSearchParams } from "expo-router";
import { currencyFormat } from "../../utils";
import PaymentWebView from "./PaymentWebView";

const CheckoutScreen = () => {
  const { courseId } = useLocalSearchParams();
  const [course, setCourse] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState("none");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [showWebView, setShowWebView] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);

  const fetchCourseDetails = async () => {
    try {
      const response = await axiosInstance.get(`/courses/${courseId}`);
      if (response.data) {
        setCourse(response.data);
      } else {
        setError("Không tìm thấy khóa học.");
      }
    } catch (err) {
      setError(`Lỗi khi tải khóa học: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPromotions = async () => {
    try {
      const response = await axiosInstance.get("/promotions");
      setPromotions(response.data.data);
      console.log("fetchPromotions:", response.data.data);
    } catch (err) {
      console.error("Error fetching promotions:", err);
      setError(`Lỗi khi tải khuyến mãi: ${err.message}`);
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
        setPaymentUrl(paymentUrl);
        setShowWebView(true);
      } else {
        alert("You have already purchased this course.");
      }
    } catch (err) {
      console.error("Error during enrollment:", err);
      alert("Enrollment failed. Please try again.");
    }
  };

  const handlePromotionChange = (promotionId) => {
    setSelectedPromotion(promotionId);
    const newPrice = calculateDiscountedPrice(course?.price, promotionId);
    setDiscountedPrice(newPrice);
  };

  useEffect(() => {
    if (courseId) {
      setIsLoading(true);
      setError(null);
      Promise.all([fetchCourseDetails(), fetchPromotions()]).finally(() => {
        setIsLoading(false);
      });
    }
  }, [courseId]);

  const calculateDiscountedPrice = (originalPrice, promotionId) => {
    const price = Number(originalPrice) || 0;
    if (promotionId === "none" || !price) return price;

    const selectedPromo = promotions.find((p) => p._id === promotionId);
    if (!selectedPromo) return price;

    const discount = (price * Number(selectedPromo.rate)) / 100;
    return price - discount;
  };

  useEffect(() => {
    const newPrice = calculateDiscountedPrice(course?.price, selectedPromotion);
    setDiscountedPrice(newPrice);
  }, [selectedPromotion, course?.price]);

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
        source={{
          uri: course?.thumbnailUrl || "https://via.placeholder.com/200",
        }}
        style={styles.image}
      />

      <Text style={styles.title}>{course?.title || "Không có tiêu đề"}</Text>

      <View style={styles.priceContainer}>
        {selectedPromotion !== "none" && (
          <Text style={styles.originalPrice}>
            Giá gốc:
            {currencyFormat.format(course?.price)}
          </Text>
        )}
        <Text style={styles.currentPrice}>
          {currencyFormat.format(
            selectedPromotion !== "none" ? discountedPrice : course?.price
          )}
        </Text>
        {selectedPromotion !== "none" && (
          <Text style={styles.savings}>
            Tiết kiệm: {currencyFormat.format(course?.price - discountedPrice)}
          </Text>
        )}
      </View>

      <View style={styles.promotionContainer}>
        <Text style={styles.label}>Chọn mã giảm giá:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedPromotion}
            onValueChange={handlePromotionChange}
            style={styles.picker}
            dropdownIconColor="#333"
            mode="dropdown"
          >
            <Picker.Item label="Không áp dụng mã giảm giá" value="none" />
            {promotions &&
              promotions.length > 0 &&
              promotions.map((promotion) => (
                <Picker.Item
                  key={promotion._id}
                  label={`${promotion.code} - Giảm ${promotion.rate}%`}
                  value={promotion._id}
                />
              ))}
          </Picker>
        </View>
      </View>

      <Modal
        visible={showWebView}
        animationType="slide"
        onRequestClose={() => setShowWebView(false)}
      >
        <PaymentWebView
          paymentUrl={paymentUrl}
          onClose={() => setShowWebView(false)}
        />
      </Modal>

      <TouchableOpacity
        style={styles.checkoutButton}
        onPress={handleEnrollment}
      >
        <Text style={styles.buttonText}>Thanh toán ngay</Text>
        <Text style={styles.buttonPrice}>
          {currencyFormat.format(
            selectedPromotion !== "none" ? discountedPrice : course?.price
          )}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  header: { fontSize: 26, fontWeight: "bold", marginBottom: 20, color: "#333" },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
    elevation: 5,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, color: "#333" },
  priceContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  originalPrice: {
    fontSize: 18,
    color: "#999",
    textDecorationLine: "line-through",
    marginBottom: 5,
  },
  currentPrice: {
    fontSize: 28,
    color: "#4B6EF5",
    fontWeight: "bold",
  },
  savings: {
    fontSize: 16,
    color: "#4CAF50",
    marginTop: 5,
  },
  promotionContainer: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pickerWrapper: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    marginTop: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    minHeight: 200,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    backgroundColor: "#fff",
    height: "70",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  checkoutButton: {
    backgroundColor: "#4B6EF5",
    padding: 20,
    borderRadius: 15,
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonPrice: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: { color: "red", fontSize: 18, textAlign: "center" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: { fontSize: 18, marginBottom: 20 },
  closeButton: { backgroundColor: "#4B6EF5", padding: 10, borderRadius: 5 },
  closeButtonText: { color: "white", fontSize: 16 },
});

export default CheckoutScreen;
