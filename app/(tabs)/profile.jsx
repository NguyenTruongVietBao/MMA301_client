import React, { useContext, useEffect } from "react";
import { View, Text, Button } from "react-native";
import { router } from "expo-router";
import { UserContext } from "../../context/UserContext";

export default function Profile() {
  const { user, clearUser } = useContext(UserContext); // Access user and clearUser from context

  useEffect(() => {
    if (!user) {
      // Redirect to login if not logged in
      router.push("/login");
    }
  }, [user]);

  const handleLogout = async () => {
    await clearUser(); // Clear user data and log out
    router.push("/login"); // Redirect to login page
  };

  if (!user) return null; // Avoid rendering until redirect

  return (
    <View className="h-full justify-center items-center">
      <Text className="text-2xl">Welcome, {user.name}!</Text>
      <Text className="text-lg">Email: {user.email}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
