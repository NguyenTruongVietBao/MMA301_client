import React from "react";
import { View, Text, Button } from "react-native";
import { Link, router } from "expo-router";
import { useAuthContext } from "../../context/AuthContext";

export default function Profile() {
  const { onLogout, authState } = useAuthContext();
  const user = authState.user;
  const handleLogout = async () => {
    await onLogout();
    router.replace("/login");
  };

  return (
    <View className="h-full justify-center items-center">
      {authState.authenticated === true ? (
        <>
          <Text>{JSON.stringify(user, null, 2)}</Text>
          <Button title="Logout" onPress={handleLogout} />
        </>
      ) : (
        <>
          <Text>You are not logged in.</Text>
          <Link href={"/login"}>Login</Link>
        </>
      )}
    </View>
  );
}
