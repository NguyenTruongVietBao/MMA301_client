import React, { useEffect } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";

const PaymentWebView = ({ paymentUrl, onClose }) => {
  const router = useRouter();

  useEffect(() => {
    const openBrowser = async () => {
      try {
        const result = await WebBrowser.openBrowserAsync(paymentUrl);

        if (result.type === "cancel") {
          Alert.alert("Xác nhận", "Bạn có chắc muốn hủy thanh toán?", [
            {
              text: "Không",
              style: "cancel",
              onPress: () => openBrowser(),
            },
            {
              text: "Có",
              onPress: () => {
                onClose();
                router.back();
              },
            },
          ]);
        }
      } catch (error) {
        console.error("Error opening browser:", error);
        Alert.alert(
          "Lỗi",
          "Không thể kết nối đến trang thanh toán. Vui lòng thử lại sau.",
          [
            {
              text: "Đóng",
              onPress: () => {
                onClose();
                router.back();
              },
            },
          ]
        );
      }
    };

    openBrowser();
  }, [paymentUrl]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#4B6EF5" />
    </View>
  );
};

export default PaymentWebView;
