import { View, Text, ScrollView, ImageBackground, Alert } from "react-native";
import React, { useState } from "react";
import { FormField } from "../../components/FormField";
import { Link, router } from "expo-router";
import CustomButton from "../../components/CustomButton";
import { useAuthContext } from "../../context/AuthContext";

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { onLogin } = useAuthContext();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    if (!onLogin) {
      Alert.alert("Login function is not available.");
      return;
    }
    setIsSubmitting(true);
    try {
      if (!form.email || !form.password) {
        Alert.alert("Please fill in all fields");
        return;
      }
      const res = await onLogin(form.email, form.password);
      if (res?.access_token) {
        router.replace("/");
      } else {
        Alert.alert(
          "Invalid credentials",
          "Please check your login information"
        );
      }
    } catch (error) {
      Alert.alert("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="h-screen">
      <ImageBackground
        source={require("../../assets/images/background-login.jpg")}
        style={{ flex: 1, justifyContent: "center" }}
        imageStyle={{ resizeMode: "cover" }} // To make sure the image covers the whole screen
      >
        <ScrollView>
          <View className="w-full justify-center min-h-[83vh] px-4">
            <Text
              className={"text-4xl text-center text-semibold font-psemibold"}
            >
              Welcome
            </Text>
            <Text
              className={"text-2xl mb-4 text-center text-semibold font-medium"}
            >
              Login to learning new things
            </Text>
            <FormField
              title={"Email"}
              value={form.email}
              otherStyles="mt-7"
              placeholder={"example@gmail.com"}
              keyboardType="email-address"
              handleChangeText={(e) =>
                setForm({
                  ...form,
                  email: e,
                })
              }
            />
            <FormField
              title={"Password"}
              value={form.password}
              otherStyles="mt-7"
              placeholder={"********"}
              handleChangeText={(e) =>
                setForm({
                  ...form,
                  password: e,
                })
              }
            />
            <CustomButton
              title={"Sign In"}
              handlePress={handleLogin}
              containerStyles={"mt-7"}
              isLoading={isSubmitting}
              textStyles={"text-xl"}
            />
            <View className={"items-center justify-center pt-5 flex-row gap-2"}>
              <Text className={"text-lg"}>Don't have any account ?</Text>
              <Link href={"/register"} className={"text-lg font-pmedium mt-1"}>
                Sign Up
              </Link>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}
