import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { TextInput } from "@/components/TextInput";

const VerifyPhone = () => {
  const router = useRouter();
  const methods = useForm();
  const onSubmit = (data) => {
    console.log("OTP Submitted: ", data);
    if (data.otp === "123456") {
      console.log("OTP verified successfully!");
      router.push("/profile");
    } else {
      methods.setError("otp", {
        type: "manual",
        message: "Incorrect OTP. Please try again.",
      });
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleBackPress} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text style={styles.heading}>Verify OTP</Text>
      </View>
      <Text style={styles.text}>Please verify your Phone Number</Text>

      <FormProvider {...methods}>
        <View style={{ width: "100%", marginTop: 30, marginBottom: 20 }}>
          <TextInput
            name="otp"
            keyboardType="numeric"
            placeholder="Enter OTP"
            label="Enter Verification Code (6-digit)"
            rules={{
              required: "OTP is required!",
              pattern: {
                value: /^[0-9]{6}$/,
                message: "Please enter a valid 6-digit OTP!",
              },
            }}
          />
        </View>
      </FormProvider>
      <View style={styles.buttonContainer}>
        <Button
          title="Verify OTP"
          style={{ width: 160 }}
          onPress={methods.handleSubmit(onSubmit)}
        />
      </View>
    </View>
  );
};

export default VerifyPhone;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 40,
  },
  backButton: {
    marginRight: 10,
    paddingVertical: 4,
    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: "#4E63BC",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    paddingLeft: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    width: "60%",
    color: "grey",
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});
