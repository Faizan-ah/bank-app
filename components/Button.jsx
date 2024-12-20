import React from "react";
import { Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";

const Button = ({ title, onPress, loading, style, textStyle, disabled }) => {
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
      {loading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
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
    backgroundColor: "#4E63BC",
  },
  pressed: {
    backgroundColor: "#253ea3", // Darker shade for pressed state
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
