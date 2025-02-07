import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#4B6EF5",
        tabBarInactiveTintColor: "#93c5fd",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopStartRadius: 25,
          borderTopEndRadius: 25,
          height: 70,
          paddingTop: 10,
          position: "absolute", // Giúp bo góc hoạt động
          left: 0,
          right: 0,
          bottom: 0,
          shadowColor: "#000", // Bóng mờ
          shadowRadius: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="my-courses"
        options={{
          title: "My Courses",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "list-circle" : "list-circle-outline"}
              color={color}
              size={29}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              name={focused ? "user-circle" : "user-circle-o"}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
