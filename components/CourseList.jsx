import { Text, ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import CourseCard from "./CourseCard";

const CourseList = ({ data }) => {
  return (
      <ScrollView contentContainerStyle={styles.container}>
        {data.length > 0 ? (
            <View style={styles.courseContainer}>
              {data.map((course) => (
                  <CourseCard
                      key={course._id}
                      _id={course._id}
                      price={course.price}
                      title={course.title}
                      description={course.description}
                      category={course.category}
                      thumbnailUrl={course.thumbnailUrl} // Update to match the API response
                  />
              ))}
            </View>
        ) : (
            <Text style={styles.noCourseText}>No courses available</Text>
        )}
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
    paddingTop: 10,
  },
  courseContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 10,
    gap: 10,
  },
  noCourseText: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
    marginTop: 20,
  },
});

export default CourseList;
