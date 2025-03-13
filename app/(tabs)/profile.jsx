import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Button,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthContext } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function Profile() {
  const { onLogout, authState } = useAuthContext();
  const router = useRouter();
  const user = authState.user;
  const handleLogout = async () => {
    await onLogout();
    router.replace("/login");
  };

  const menuItems = [
    {
      icon: "book-outline",
      title: "Khóa học của tôi",
      onPress: () => router.push("/my-courses"),
    },
    {
      icon: "heart-outline",
      title: "Khóa học yêu thích",
      onPress: () => router.push("/favorites"),
    },
    {
      icon: "notifications-outline",
      title: "Thông báo",
      onPress: () => router.push("/notifications"),
    },
    {
      icon: "settings-outline",
      title: "Cài đặt",
      onPress: () => router.push("/settings"),
    },
    {
      icon: "help-circle-outline",
      title: "Trợ giúp",
      onPress: () => router.push("/help"),
    },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {authState.authenticated && (
        <View className="w-full space-y-6">
          {/* Header Section */}
          <View className="bg-[#4B6EF5] p-6 pb-12 rounded-2xl m-3">
            <View className="items-center">
              <View className="relative">
                <Image
                  source={{
                    uri: user?.avatar || "https://via.placeholder.com/100",
                  }}
                  className="w-24 h-24 rounded-full border-4 border-white"
                />
                <TouchableOpacity className="absolute bottom-0 right-0 bg-white rounded-full p-2">
                  <Ionicons name="camera" size={20} color="#4B6EF5" />
                </TouchableOpacity>
              </View>
              <Text className="text-xl font-bold text-white mt-4">
                {user?.name || "User"}
              </Text>
              <Text className="text-blue-100">{user?.email || ""}</Text>
            </View>
          </View>

          {/* Menu Section */}
          <View className="px-10 -mt-8">
            <View className="bg-white rounded-xl shadow-sm p-4 space-y-2">
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={item.onPress}
                  className="flex-row items-center p-4 border-b border-gray-100 last:border-0"
                >
                  <Ionicons name={item.icon} size={24} color="#4B6EF5" />
                  <Text className="ml-4 text-gray-700 flex-1">
                    {item.title}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
                </TouchableOpacity>
              ))}
            </View>

            {/* Account Info Section */}
            <View className="bg-white rounded-xl shadow-sm p-4 mt-4">
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                Thông tin tài khoản
              </Text>
              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Số điện thoại</Text>
                  <Text className="text-gray-800">
                    {user?.phone || "Chưa cập nhật"}
                  </Text>
                </View>
                <View className="flex-row justify-between mt-3">
                  <Text className="text-gray-600">Ngày tham gia</Text>
                  <Text className="text-gray-800">
                    {new Date().toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </Text>
                </View>
              </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-red-500 py-4 rounded-xl mt-4 mb-8"
            >
              <Text className="text-white text-center font-semibold">
                Đăng xuất
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

// import React from "react";
// import { View, Text, Button } from "react-native";
// import { Link, router } from "expo-router";
// import { useAuthContext } from "../../context/AuthContext";

// export default function Profile() {
//   const { onLogout, authState } = useAuthContext();
//   const user = authState.user;
//   const handleLogout = async () => {
//     await onLogout();
//     router.replace("/login");
//   };

//   return (
//     <View className="h-full justify-center items-center">
//       {authState.authenticated === true ? (
//         <>
//           <Text>{JSON.stringify(user, null, 2)}</Text>
//           <Button title="Logout" onPress={handleLogout} />
//         </>
//       ) : (
//         <>
//           <Text>You are not logged in.</Text>
//           <Link href={"/login"}>Login</Link>
//         </>
//       )}
//     </View>
//   );
// }
