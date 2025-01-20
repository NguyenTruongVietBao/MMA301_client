import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const middleware = async (route) => {
  try {
    // Get the logged-in user from AsyncStorage
    const user = await AsyncStorage.getItem("user");

    // Parse user data if available
    const isAuthenticated = user ? JSON.parse(user) : null;

    // Define protected routes
    const protectedRoutes = ["/profile", "/favorite"];
    const publicRoutes = ["/login", "/register"];

    if (protectedRoutes.includes(route) && !isAuthenticated) {
      // Redirect to login if the user is not authenticated
      router.replace("/login");
    } else if (publicRoutes.includes(route) && isAuthenticated) {
      // Redirect to home if the user is authenticated
      router.replace("/");
    }

    // Proceed if no redirection is needed
    return route;
  } catch (error) {
    console.error("Middleware Error:", error);
  }
};
