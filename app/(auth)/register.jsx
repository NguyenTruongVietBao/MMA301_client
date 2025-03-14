import { View, Text, ScrollView, ImageBackground, Alert } from "react-native";
import React, { useState } from "react";
import { FormField } from "../../components/FormField";
import { Link, router } from "expo-router";
import CustomButton from "../../components/CustomButton";
import { useAuthContext } from "../../context/AuthContext";

export default function Register() {
  const { onRegister } = useAuthContext();
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    if (!form.email || !form.password || !form.username || !form.phone) {
      Alert.alert(
        "Error",
        "All fields are required. Please fill out the form completely."
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }
    if (form.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await onRegister(
        form.username,
        form.email,
        form.password,
        form.phone
      );
      if (res) {
        Alert.alert("Register success", "Please login to your account");
        router.push("/login");
      }
    } catch (error) {
      Alert.alert("Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="h-full">
      <ImageBackground
        source={require("../../assets/images/background-login.jpg")}
        style={{ flex: 1, justifyContent: "center" }}
        imageStyle={{ resizeMode: "cover" }}
      >
        <ScrollView>
          <View className="w-full justify-center min-h-[83vh] px-4 mt-16">
            <Text
              className={"text-4xl text-center text-semibold font-psemibold"}
            >
              Register account
            </Text>
            <FormField
              title={"Username"}
              value={form.username}
              placeholder={"Viet Bao"}
              otherStyles="mt-6"
              keyboardType={"default"}
              handleChangeText={(e) =>
                setForm({
                  ...form,
                  username: e,
                })
              }
            />

            <FormField
              title={"Email"}
              value={form.email}
              otherStyles="mt-6"
              placeholder={"example@gmail.com"}
              keyboardType={"email-address"}
              handleChangeText={(e) =>
                setForm({
                  ...form,
                  email: e,
                })
              }
            />
            <FormField
              title={"Phone"}
              value={form.phone}
              placeholder={"0987654321"}
              otherStyles="mt-6"
              keyboardType={"phone-pad"}
              handleChangeText={(e) =>
                setForm({
                  ...form,
                  phone: e,
                })
              }
            />
            <FormField
              title={"Password"}
              value={form.password}
              placeholder={"********"}
              otherStyles="mt-6"
              keyboardType={"default"}
              handleChangeText={(e) =>
                setForm({
                  ...form,
                  password: e,
                })
              }
            />
            <CustomButton
              title={"Create"}
              handlePress={handleRegister}
              containerStyles={"mt-7"}
              isLoading={isSubmitting}
              textStyles={"text-xl"}
            />
            <View className={"justify-center pt-5 flex-row gap-2"}>
              <Text className={"text-lg"}>Already account ?</Text>
              <Link href={"/login"} className={"text-lg font-pmedium"}>
                Sign In
              </Link>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}
