import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import axiosInstance from "../../utils/axiosInstance";

export default function PaymentCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    WebBrowser.maybeCompleteAuthSession();

    const handlePaymentResult = async () => {
      try {
        // Kiểm tra response code từ VNPay
        if (params.vnp_ResponseCode === "00") {
          // Thanh toán thành công
          // Gọi API để cập nhật trạng thái thanh toán
          await axiosInstance.post("/payments/verify", {
            vnp_Amount: params.vnp_Amount,
            vnp_BankCode: params.vnp_BankCode,
            vnp_BankTranNo: params.vnp_BankTranNo,
            vnp_CardType: params.vnp_CardType,
            vnp_OrderInfo: params.vnp_OrderInfo,
            vnp_PayDate: params.vnp_PayDate,
            vnp_ResponseCode: params.vnp_ResponseCode,
            vnp_TmnCode: params.vnp_TmnCode,
            vnp_TransactionNo: params.vnp_TransactionNo,
            vnp_TransactionStatus: params.vnp_TransactionStatus,
            vnp_TxnRef: params.vnp_TxnRef,
            vnp_SecureHash: params.vnp_SecureHash,
          });

          // Chuyển hướng đến trang thành công
          router.replace("/my-courses");
        } else {
          // Thanh toán thất bại
          router.replace({
            pathname: "/checkout/failed",
            params: {
              error: "Thanh toán không thành công",
              code: params.vnp_ResponseCode,
              status: params.vnp_TransactionStatus,
            },
          });
        }
      } catch (error) {
        console.error("Error handling payment callback:", error);
        router.replace({
          pathname: "/checkout/failed",
          params: {
            error: "Có lỗi xảy ra khi xử lý thanh toán",
          },
        });
      }
    };

    handlePaymentResult();
  }, [params]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#4B6EF5" />
      <Text style={{ marginTop: 20 }}>Đang xử lý kết quả thanh toán...</Text>
    </View>
  );
}
