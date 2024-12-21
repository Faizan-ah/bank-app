import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView, Image } from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import { Link, useRouter } from "expo-router";
import { TextInput } from "@/components/TextInput";
import Button from "@/components/Button";
import { PHONE_REGEX } from "@/utils/constants";
import { getUserByCredentials } from "@/services/userService";
import { saveItem } from "@/utils/storage";

const Signup = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
      setLoading(false);
      return user !== null;
    } catch (error) {
      setLoading(false);
      return false;
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const userExists = await doesUserExists(data.number);
    if (userExists) {
      Alert.alert("User found", "This user is already present!");
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.centeredContainer}>
        <View style={styles.imageCircleContainer}>
          <View style={styles.imageCircle1}></View>
          <View style={styles.imageCircle2}></View>
        </View>
        <FormProvider {...methods}>
          <Text style={styles.heading}>Sign Up</Text>
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
            title="Sign Up"
            loading={loading}
            disabled={loading}
            style={{ width: 160 }}
            onPress={methods.handleSubmit(onSubmit, onError)}
          />
        </View>
        <View style={styles.linkContainer}>
          <Text style={{ color: "grey" }}>
            Already have an account?{" "}
            <Link href="/login" style={styles.link}>
              Login
            </Link>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Signup;

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
  linkContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  link: {
    color: "#4E63BC",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  buttonContainer: {
    marginTop: 20,
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
