import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";

const Button = ({ title, onPress, style, textStyle, disabled }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        style,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
      disabled={disabled}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 15,
    elevation: 3,
    backgroundColor: "#007bff",
  },
  pressed: {
    backgroundColor: "#005bb5", // Darker shade for pressed state
  },
  disabled: {
    backgroundColor: "#cccccc", // Lighter gray for disabled state
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Button;
