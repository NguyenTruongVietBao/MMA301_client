import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Bạn có thể dùng bất kỳ thư viện icon nào

const Footer = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconContainer}>
        <Ionicons name="home-outline" size={24} color="#4B6EF5" />
        <Text style={[styles.label, styles.activeLabel]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconContainer}>
        <Ionicons name="chatbubble-outline" size={24} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconContainer}>
        <Ionicons name="notifications-outline" size={24} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconContainer}>
        <Ionicons name="person-outline" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  iconContainer: {
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    color: "#000",
  },
  activeLabel: {
    color: "#4B6EF5",
  },
});

export default Footer;
