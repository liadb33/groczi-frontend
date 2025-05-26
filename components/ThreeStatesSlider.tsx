import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";

interface ThreeStateSliderProps {
  value: number;
  onValueChange: (v: number) => void;
  onSlidingComplete: (v: number) => void;
}

export default function ThreeStateSlider({
  value,
  onValueChange,
  onSlidingComplete,
}: ThreeStateSliderProps) {

    
  return (
    <View style={styles.wrapper}>
      <Text
        style={[
          styles.label,
          value === 0 || value === 0.5
            ? styles.activeLabel
            : styles.inactiveLabel,
        ]}
      >
        מרחק
      </Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={value}
        onSlidingComplete={onSlidingComplete}
        onValueChange={onValueChange}
        step={0.5}
        minimumTrackTintColor="#7FAAC7"
        maximumTrackTintColor="#E6EEF4"
        thumbTintColor="#7FAAC7"
      />
      <Text
        style={[
          styles.label,
          value === 1 || value === 0.5
            ? styles.activeLabel
            : styles.inactiveLabel,
        ]}
      >
        עלות
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFB",
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    width: 60,
    textAlign: "center",
  },
  activeLabel: {
    color: "#316088",
  },
  inactiveLabel: {
    color: "#A6B3C8",
  },
  slider: {
    flex: 1,
    height: 30,
    marginHorizontal: 8,
  },
});
