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

const ProfilePage = () => {
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
    alert("Profile updated successfully!");
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

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <FormProvider {...methods}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={styles.heading}> Profile</Text>
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
            label="NIN"
            disabled={true}
            keyboardType="numeric"
          />

          <TextInput
            name="accountNum"
            label="Account Number"
            disabled={true}
            keyboardType="numeric"
          />
          <TextInput
            name="phoneNum"
            label="Phone Number"
            disabled={true}
            keyboardType="numeric"
          />

          <View style={styles.buttonContainer}>
            <Button
              title="Save Profile"
              onPress={methods.handleSubmit(onSubmit, onError)}
            />
            <Pressable onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </FormProvider>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  statusText: {
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  logoutButton: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
