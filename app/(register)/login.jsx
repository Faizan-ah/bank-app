import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  Alert,
  ScrollView,
} from "react-native";
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.centeredContainer}>
        <View style={styles.imageCircleContainer}>
          <View style={styles.imageCircle1}></View>
          <View style={styles.imageCircle2}></View>
        </View>
        <FormProvider {...methods}>
          <Text style={styles.heading}>Sign In</Text>
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
        <View style={styles.linkContainer}>
          <Text style={{ color: "grey" }}>
            Don't have an account?{" "}
            <Link href="/signup" style={styles.link}>
              Signup
            </Link>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

Login.options = {
  headerShown: false,
};
export default Login;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 100,
    paddingHorizontal: 30,
    backgroundColor: "#fff",
  },
  centeredContainer: {
    width: "100%",
  },
  heading: {
    color: "black",
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "left",
  },
  link: {
    color: "#4E63BC",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  linkContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  imageCircleContainer: { flexDirection: "row", marginVertical: 5 },
  imageCircle1: {
    width: 50,
    height: 50,
    backgroundColor: "#4E63BC",
    borderRadius: "50%",
  },
  imageCircle2: {
    width: 50,
    height: 50,
    marginLeft: -20,
    backgroundColor: "lightblue",
    borderRadius: "50%",
  },
});
