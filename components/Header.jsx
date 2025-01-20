import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function Header() {
  return (
    <View style={styles.container}>
      {/* Greeting and Notification */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.subGreeting}>Good Morning</Text>
        </View>
        <TouchableOpacity style={styles.notification}>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#aaa" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Search"
            placeholderTextColor="#aaa"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <MaterialIcons name="arrow-drop-down" size={24} color="#aaa" />
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#4B6EF5",
    padding: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    margin: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  subGreeting: {
    fontSize: 16,
    color: "#fff",
    marginTop: 4,
  },
  notification: {
    position: "relative",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 8,
  },
  notificationDot: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    backgroundColor: "#FF4D4F",
    borderRadius: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
  },
  filterText: {
    fontSize: 14,
    color: "#aaa",
  },
});
