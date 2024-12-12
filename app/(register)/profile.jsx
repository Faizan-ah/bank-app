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
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as LocalAuthentication from "expo-local-authentication";
import { useForm, FormProvider } from "react-hook-form";
import { TextInput } from "@/components/TextInput";
import Button from "@/components/Button";
import { useRouter } from "expo-router";

const Profile = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [fingerprintVerified, setFingerprintVerified] = useState(false);
  const router = useRouter();
  const methods = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      nin: "",
    },
  });

  const onSubmit = (data) => {
    console.log(fingerprintVerified ? { data } : "verify fingerprint");
    router.push("/home");
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
      alert("Fingerprint authentication successful!");
    } else {
      alert("Fingerprint authentication failed!");
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

          <TextInput
            name="firstName"
            label="First Name"
            placeholder="Enter First Name"
            rules={{ required: "First name is required!" }}
          />

          <TextInput
            name="lastName"
            label="Last Name"
            placeholder="Enter Last Name"
            rules={{ required: "Last name is required!" }}
          />

          <TextInput
            name="nin"
            label="Enter your NIN"
            placeholder="000 0000 0000"
            keyboardType="numeric"
            rules={{ required: "NIN is required!" }}
          />

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
              title="Save Profile"
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
    backgroundColor: "#f1f5f9",
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
    backgroundColor: "blue",
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
