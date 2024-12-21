import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as LocalAuthentication from "expo-local-authentication";
import { useForm, FormProvider } from "react-hook-form";
import { TextInput } from "@/components/TextInput";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { login, register } from "@/services/authService";
import { NIN_REGEX } from "@/utils/constants";
import { getItem, saveItem } from "@/utils/storage";

const Profile = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [fingerprintVerified, setFingerprintVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const methods = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      nin: "",
    },
  });

  const signupUser = async (data) => {
    try {
      const signupItem = await getItem("signupCredentials");
      const { phoneNumber, password } = signupItem;
      const response = await register({
        phoneNumber,
        password,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        nin: data.nin.trim(),
      });
      if (response.status === 200) {
        const response = await login(phoneNumber, password.trim());
        await saveItem("authToken", response.token);
        await saveItem("user", response.userDto);
        setLoading(false);
        router.push("/home");
      }
    } catch (error) {
      Alert.alert("Something went wrong. Please try again.");
      router.push("/login");
    }
  };

  const onSubmit = (data) => {
    try {
      if (fingerprintVerified) {
        setLoading(true);
        signupUser(data);
      } else {
        Alert.alert("Verification Error", "Please verify fingerprint first!");
      }
    } catch (error) {
      Alert.alert(
        "Server Error",
        error.message || "Something went wrong. Please try again."
      );
    }
  };

  const onError = (errors) => {
    console.log("error", errors);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  const authenticateFingerprint = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate with Fingerprint",
      fallbackLabel: "Use Passcode",
    });

    if (result.success) {
      setFingerprintVerified(true);
      Alert.alert("Verification", "Fingerprint authentication successful!");
    } else {
      Alert.alert("Verification Error", "Fingerprint authentication failed!");
    }
  };

  return (
    <FormProvider {...methods}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={styles.heading}>Profile</Text>
            <Text>Please set up your profile</Text>
          </View>

          <View style={styles.imageContainer}>
            {profilePicture ? (
              <Image
                source={{ uri: profilePicture }}
                style={styles.profileImage}
              />
            ) : (
              <Pressable onPress={pickImage}>
                <MaterialIcons name="file-upload" size={50} color="white" />
              </Pressable>
            )}
          </View>
          <View style={{ width: "100%" }}>
            <TextInput
              name="firstName"
              label="First Name"
              labelStyles={{ color: "#4E63BC", fontWeight: "bold" }}
              placeholder="Enter First Name"
              rules={{ required: "First name is required!" }}
            />

            <TextInput
              name="lastName"
              label="Last Name"
              labelStyles={{ color: "#4E63BC", fontWeight: "bold" }}
              placeholder="Enter Last Name"
              rules={{ required: "Last name is required!" }}
            />

            <TextInput
              name="nin"
              label="Enter your NIN"
              labelStyles={{ color: "#4E63BC", fontWeight: "bold" }}
              placeholder="eg. 010199023M"
              onChangeText={(text) =>
                methods.setValue("nin", text.toUpperCase())
              }
              rules={{
                required: "NIN is required!",
                pattern: {
                  value: NIN_REGEX,
                  message: "Please enter a valid NIN!",
                },
              }}
            />
          </View>

          <Pressable
            onPress={authenticateFingerprint}
            style={styles.fingerprintButton}
          >
            <MaterialIcons name="fingerprint" size={80} color="white" />
          </Pressable>

          <Text
            style={{
              ...styles.statusText,
              color: fingerprintVerified ? "green" : "red",
            }}
          >
            {fingerprintVerified
              ? "Fingerprint Verified"
              : "Fingerprint not verified"}
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              title="Setup"
              disabled={loading}
              loading={loading}
              style={{ width: 120 }}
              onPress={methods.handleSubmit(onSubmit, onError)}
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </FormProvider>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  header: { marginVertical: 20, marginHorizontal: "auto" },
  heading: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 24,
    fontWeight: "bold",
  },
  imageContainer: {
    marginHorizontal: "auto",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: "#4E63BC",
    borderRadius: 50,
    width: 100,
    height: 100,
  },
  fingerprintButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "black",
    padding: 10,
    borderRadius: 50,
    marginVertical: 15,
  },
  fingerprintText: {
    color: "white",
    marginLeft: 10,
  },
  statusText: {
    marginBottom: 20,
  },
  buttonContainer: {
    alignItems: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
});
