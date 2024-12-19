import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import { Link, useRouter } from "expo-router";
import { TextInput } from "@/components/TextInput";
import Button from "@/components/Button";
import { PHONE_REGEX } from "@/utils/constants";
import { getUserByCredentials } from "@/services/userService";
import { saveItem } from "@/utils/storage";

const Signup = () => {
  const router = useRouter();
  const methods = useForm({
    defaultValues: {
      number: "",
      password: "",
      confirmPassword: "",
    },
  });

  const doesUserExists = async (phone) => {
    try {
      const user = await getUserByCredentials({
        identifier: "phone",
        phone: phone,
      });
      return user !== null;
    } catch (error) {
      return false;
    }
  };

  const onSubmit = async (data) => {
    const userExists = await doesUserExists(data.number); // Wait for the check to complete
    if (userExists) {
      alert("User already exists!"); // Show alert if user exists
    } else {
      saveItem("signupCredentials", {
        phoneNumber: data.number,
        password: data.password.trim(),
      });
      router.push({
        pathname: "/add-phone",
        params: { phone: data.number },
      });
    }
  };

  const onError = (errors) => {
    console.log("error", errors);
  };

  return (
    <View style={styles.container}>
      <View style={styles.centeredContainer}>
        <FormProvider {...methods}>
          <Text style={styles.heading}>Sign Up</Text>

          <TextInput
            name="number"
            label="Number"
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
          <TextInput
            name="password"
            label="Password"
            secureTextEntry
            rules={{
              required: "Password is required!",
              minLength: {
                value: 5,
                message: "Password must be at least 5 characters long!",
              },
            }}
          />

          <TextInput
            name="confirmPassword"
            label="Confirm Password"
            secureTextEntry
            rules={{
              required: "Password confirmation is required!",
              validate: (val) =>
                methods.watch("password").trim() === val.trim() ||
                "Passwords do not match",
            }}
          />
        </FormProvider>
        <View style={styles.buttonContainer}>
          <Button
            title="Signup"
            onPress={methods.handleSubmit(onSubmit, onError)}
          />
        </View>
        <View
          style={{
            marginHorizontal: "auto",
            width: "65%",
            paddingVertical: 10,
          }}
        >
          <Text>
            Already have an account?{" "}
            <Link href="/login" style={styles.link}>
              Login
            </Link>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    marginHorizontal: "auto",
    width: "100%",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
  },
  centeredContainer: { width: "80%" },
  heading: {
    color: "black",
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
  },
  link: {
    color: "blue",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: "center",
  },
});
