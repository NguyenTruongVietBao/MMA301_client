import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function PaymentFailedScreen() {
  const { error, code, status } = useLocalSearchParams();
  const router = useRouter();

  const getErrorMessage = () => {
    if (code && status) {
      return `Mã lỗi: ${code}\nTrạng thái: ${status}\n${error || ""}`;
    }
    return error || "Đã có lỗi xảy ra trong quá trình thanh toán";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thanh toán thất bại</Text>
      <Text style={styles.message}>{getErrorMessage()}</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Thử lại</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.homeButton]}
        onPress={() => router.push("/courses")}
      >
        <Text style={styles.buttonText}>Về trang khóa học</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#ff3b30",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#4B6EF5",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 15,
    width: "80%",
  },
  homeButton: {
    backgroundColor: "#34C759",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
