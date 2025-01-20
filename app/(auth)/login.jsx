import { View, Text, ScrollView, ImageBackground, Alert } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { FormField } from "../../components/FormField";
import { Link, router } from "expo-router";
import CustomButton from "../../components/CustomButton";
import { UserContext } from "../../context/UserContext";

export default function Login() {
  const { user, setUser } = useContext(UserContext);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);

  const handleLogin = async () => {
    setIsSubmitting(true);
    try {
      const userData = {
        id: 1,
        email: form.email,
        name: "John Doe",
      };

      await setUser(userData);

      router.push("/", { relativeToDirectory: true });
    } catch (error) {
      Alert.alert("Error", "Failed to log in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="h-full">
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
              Login to continue your account
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
            <View className={"justify-center pt-5 flex-row gap-2"}>
              <Text className={"text-lg"}>Don't have any account ?</Text>
              <Link href={"/register"} className={"text-lg font-pmedium"}>
                Sign Up
              </Link>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}
