import { View, Text, StyleSheet, BackHandler, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { TextInput } from "../../components/TextInput";
import { useForm, FormProvider } from "react-hook-form";
import { Link, useRouter } from "expo-router";
import Button from "@/components/Button";
import { login } from "@/services/authService";
import { saveItem } from "@/utils/storage";
import { PHONE_REGEX } from "@/utils/constants";
const Login = () => {
  const { ...methods } = useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // Handle back button press
  useEffect(() => {
    const backAction = () => {
      Alert.alert("Exit App", "Are you sure you want to exit?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // Cleanup the listener on unmount
    return () => backHandler.remove();
  }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const { number: phoneNumber, password } = data;
      const response = await login(phoneNumber, password.trim());
      await saveItem("authToken", response.token);
      await saveItem("user", response.userDto);
      setLoading(false);
      router.push("/home");
    } catch (error) {
      setLoading(false);
      alert(error.message || "Something went wrong. Please try again.");
    }
  };

  const onError = (errors, e) => {
    return console.log(errors);
  };

  return (
    <View style={styles.container}>
      <View style={styles.centeredContainer}>
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
                value: PHONE_REGEX,
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
            style={{ width: 130 }}
            loading={loading}
            disabled={loading}
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
    color: "#007bff",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: "center",
  },
});
