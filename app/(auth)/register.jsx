import { View, Text, ScrollView, ImageBackground, Alert } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { FormField } from "../../components/FormField";
import { Link, router } from "expo-router";
import CustomButton from "../../components/CustomButton";
import { UserContext } from "../../context/UserContext";

export default function Login() {
  const { user } = useContext(UserContext); // Access the user from context
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);

  const handleLogin = () => {
    // TODO: Send login request to the server
    Alert.alert("Data: ", form.email + form.password);
  };

  return (
    <View className="h-full">
      <ImageBackground
        source={require("../../assets/images/background-login.jpg")}
        style={{ flex: 1, justifyContent: "center" }}
        imageStyle={{ resizeMode: "cover" }} // To make sure the image covers the whole screen
      >
        <ScrollView>
          <View className="w-full justify-center min-h-[83vh] px-4 mt-16">
            <Text
              className={"text-4xl text-center text-semibold font-psemibold"}
            >
              Register account
            </Text>
            <FormField
              title={"Fullname"}
              value={form.fullName}
              placeholder={"Nguyen Van A"}
              otherStyles="mt-6"
              handleChangeText={(e) =>
                setForm({
                  ...form,
                  fullName: e,
                })
              }
            />

            <FormField
              title={"Email"}
              value={form.email}
              otherStyles="mt-6"
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
              title={"Phone"}
              value={form.phone}
              placeholder={"0987654321"}
              otherStyles="mt-6"
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
              handleChangeText={(e) =>
                setForm({
                  ...form,
                  password: e,
                })
              }
            />
            <CustomButton
              title={"Create"}
              handlePress={handleLogin}
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
