import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import { Link, useRouter } from "expo-router";
import { TextInput } from "@/components/TextInput";
import Button from "@/components/Button";

const Signup = () => {
  const router = useRouter();
  const methods = useForm();

  const onSubmit = (data) => {
    console.log({ data });
    router.push({
      pathname: "/add-phone",
      params: { phone: data.number },
    });
  };

  const onError = (errors) => {
    console.log("error", errors);
  };

  return (
    <View style={styles.container}>
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

        <TextInput
          name="confirmPassword"
          label="Confirm Password"
          secureTextEntry
          rules={{
            required: "Password confirmation is required!",
            validate: (val) =>
              methods.watch("password") === val || "Passwords do not match",
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
        style={{ marginHorizontal: "auto", width: "65%", paddingVertical: 10 }}
      >
        <Text>
          Already have an account?{" "}
          <Link href="/login" style={styles.link}>
            Login
          </Link>
        </Text>
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
    color: "blue",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: "center",
  },
});
