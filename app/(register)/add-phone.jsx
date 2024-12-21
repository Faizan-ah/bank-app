import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { TextInput } from "@/components/TextInput";
import { useForm, FormProvider } from "react-hook-form";
import { MaterialIcons } from "@expo/vector-icons";
import Button from "@/components/Button";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PHONE_REGEX } from "@/utils/constants";

const AddPhone = () => {
  const { phone } = useLocalSearchParams();
  const methods = useForm({
    defaultValues: {
      number: phone || "",
    },
  });
  const router = useRouter();

  const onSubmit = (data) => {
    console.log("asd", { data });
    // Simulate OTP sending (you would call an API to send OTP in a real case)
    // Assuming OTP is "123456" for demo purposes.
    router.push("/verify-phone");
  };

  const onError = (errors) => {
    console.log("error", errors);
  };

  const handleBackPress = () => {
    if (router) {
      router.back();
    } else {
      console.log("Back pressed");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleBackPress} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text style={styles.heading}>Phone Number</Text>
      </View>
      <Text style={styles.text}>Please confirm your mobile phone number</Text>
      <FormProvider {...methods}>
        <View style={{ width: "100%", marginTop: 30, marginBottom: 20 }}>
          <TextInput
            name="number"
            label="Phone Number"
            keyboardType="phone-pad"
            placeholder="e.g. +358123123123"
            rules={{
              required: "Phone number is required!",
              pattern: {
                value: PHONE_REGEX,
                message: "Please enter a valid phone number!",
              },
            }}
          />
        </View>
      </FormProvider>
      <View style={styles.buttonContainer}>
        <Button
          title="Confirm"
          style={{ width: 160 }}
          onPress={methods.handleSubmit(onSubmit, onError)}
        />
      </View>
    </View>
  );
};

export default AddPhone;

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
    marginTop: 5,
    alignItems: "center",
  },
});
