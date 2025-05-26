import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const CustomRTLToast = ({
  text1,
  text2,
  style,
  ...rest
}: {
  text1: string;
  text2: string;
  style: any;
}) => (
  <View style={[styles.container, style]}>
    {/* Right border */}
    <View style={styles.border} />
    <View style={styles.content}>
      <Text style={styles.text1}>{text1}</Text>
      {text2 ? <Text style={styles.text2}>{text2}</Text> : null}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginVertical: 8,
    // Limit width and center the toast
    maxWidth: width * 0.8, // 80% of screen width
    minWidth: width * 0.6, // Optional: minimum width
    alignSelf: "center", // Center horizontally
    minHeight: 60,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  border: {
    width: 6,
    height: "100%",
    backgroundColor: "#006ee6",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    marginLeft: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  text1: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    textAlign: "right",
  },
  text2: {
    fontSize: 14,
    color: "#555",
    textAlign: "right",
    marginTop: 2,
  },
});
