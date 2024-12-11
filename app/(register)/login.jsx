import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import { TextInput } from "../../components/TextInput";
import {
  useForm,
  FormProvider,
  SubmitHandler,
  SubmitErrorHandler,
} from "react-hook-form";
import { Pressable } from "react-native";
import { Link, useRouter } from "expo-router";
import Button from "@/components/Button";

const Login = () => {
  const { ...methods } = useForm();
  const router = useRouter();
  const onSubmit = (data) => {
    console.log({ data });
    router.push("/home");
  };

  const onError = (errors, e) => {
    return console.log(errors);
  };

  return (
    <View style={styles.container}>
      <FormProvider {...methods}>
        <Text style={styles.heading}>Login</Text>
        <TextInput
          name="number"
          label="Number"
          keyboardType="phone-pad"
          placeholder="e.g. +358123123123"
          rules={{
            required: "Phone number is required!",
            pattern: {
              value: /^[+]?[1-9]\d{1,14}$/,
              message: "Please enter a valid phone number!",
            },
          }}
        />
        <TextInput
          name="password"
          label="Password"
          secureTextEntry
          rules={{ required: "Password is required!" }}
        />
      </FormProvider>
      <View style={styles.buttonContainer}>
        <Button
          title="Login"
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
          Don't have an account?{" "}
          <Link href="/signup" style={styles.link}>
            Signup
          </Link>
        </Text>
      </View>
    </View>
  );
};

Login.options = {
  headerShown: false,
};
export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    width: "80%",
    marginHorizontal: "auto",
  },
  heading: {
    color: "black",
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
  },
  link: {
    color: "#007bff",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: "center",
  },
});
