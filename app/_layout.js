import { SplashScreen, Stack, useSegments } from "expo-router";
import "../global.css";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { UserProvider } from "../context/UserContext";
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const segments = useSegments();

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
    const checkRoute = async () => {
      const currentRoute = `/${segments.join("/")}`;
      await middleware(currentRoute);
    };

    checkRoute();
  }, [fontsLoaded, error, segments]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <UserProvider>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="detailCategory/[categoryId]"
          options={{ title: "List course" }}
        />
        <Stack.Screen
          name="detailCourse/[courseId]"
          options={{
            headerBackButtonDisplayMode: false,
          }}
        />
      </Stack>
    </UserProvider>
  );
};

export default RootLayout;
