import "../global.css";
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { AuthProvider } from "../context/AuthContext";
import { MyCourseProvider } from "../context/MyCourseContext";
import { TouchableOpacity, View } from "react-native";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { Menu, PaperProvider } from "react-native-paper";
import * as Linking from "expo-linking";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) {
      throw error;
    }
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  useEffect(() => {
    const subscription = Linking.addEventListener("url", handleDeepLink);
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleDeepLink = ({ url }) => {
    console.log("Received URL:", url);
  };

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <AuthProvider>
      <MyCourseProvider>
        <PaperProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen
              name="detailCategory/[categoryId]"
              options={({ navigation }) => ({
                title: "",
                headerStyle: {
                  backgroundColor: "#f1f5f9",
                },
                headerTintColor: "#000",
                headerRight: () => <MenuButton navigation={navigation} />,
              })}
            />
            <Stack.Screen
              name="detailCourse/[courseId]"
              options={({ navigation }) => ({
                title: "",
                headerStyle: {
                  backgroundColor: "#f1f5f9",
                },
                headerTintColor: "#000",
                headerRight: () => <MenuButton navigation={navigation} />,
              })}
            />
            <Stack.Screen
              name="checkout/payment"
              options={{
                headerBackButtonDisplayMode: false,
                title: "Payment",
              }}
            />
          </Stack>
        </PaperProvider>
      </MyCourseProvider>
    </AuthProvider>
  );
};

export default RootLayout;

const MenuButton = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <View style={{ marginRight: 10 }}>
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        theme={{
          colors: {
            background: "#fff",
          },
        }}
        anchor={
          <TouchableOpacity onPress={() => openMenu(true)}>
            <Ionicons name="menu" size={28} color="#2563eb" />
          </TouchableOpacity>
        }
        style={{ marginTop: 40, marginLeft: 200 }}
      >
        <Menu.Item
          onPress={() => {
            setMenuVisible(false);
            navigation.navigate("(tabs)", { screen: "index" });
          }}
          title="Home"
          leadingIcon={() => <Ionicons name="home" size={24} color="black" />}
        />
        <Menu.Item
          onPress={() => {
            setMenuVisible(false);
            navigation.navigate("(tabs)", { screen: "favorites" });
          }}
          title="Favorites"
          leadingIcon={() => <Ionicons name="heart" size={24} color="black" />}
        />
        <Menu.Item
          onPress={() => {
            setMenuVisible(false);
            navigation.navigate("(tabs)", { screen: "profile" });
          }}
          title="Profile"
          leadingIcon={() => <Ionicons name="person" size={24} color="black" />}
        />
        <Menu.Item
          onPress={() => {
            setMenuVisible(false);
            navigation.navigate("(tabs)", { screen: "my-courses" });
          }}
          title="My Courses"
          leadingIcon={() => <Ionicons name="book" size={24} color="black" />}
        />
      </Menu>
    </View>
  );
};
