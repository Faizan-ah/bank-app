import React, { useEffect, useState } from "react";
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
import { getItem, removeItem } from "@/utils/storage";
import { updateUserProfile } from "@/services/userService";
import AwesomeAlert from "react-native-awesome-alerts";

const ProfilePage = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [fingerprintVerified, setFingerprintVerified] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();
  const methods = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      nin: "",
    },
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = await getItem("user");
        if (user) {
          methods.setValue("firstName", user.first_name || "");
          methods.setValue("lastName", user.last_name || "");
          methods.setValue("nin", user.nin || "");
          methods.setValue("accountNum", user.account_number || "");
          methods.setValue("phoneNum", user.phone_number || "");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const updateProfile = async (data) => {
    try {
      await updateUserProfile({
        first_name: data.firstName,
        last_name: data.lastName,
      });
      setShowAlert(true);
    } catch (error) {
      console.log("error", error);

      alert(error.message || "Something went wrong. Please try again.");
    }
  };
  const onSubmit = (data) => {
    updateProfile(data);
    // router.push("/home");
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

  const handleLogout = async () => {
    try {
      await removeItem("authToken");
      router.push("/login");
    } catch (error) {
      console.error("Error removing login status:", error);
    }
  };

  return (
    <FormProvider {...methods}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={styles.heading}>Profile</Text>
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
              style={{ width: "45%" }}
              onPress={methods.handleSubmit(onSubmit, onError)}
            />
            <Pressable onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Success"
        titleStyle={{ color: "green", fontWeight: "bold" }}
        message="Profile updated successfully!"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="OKAY"
        confirmButtonColor="#007bff"
        onConfirmPressed={() => setShowAlert(false)}
      />
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
  statusText: {
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  logoutButton: {
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 15,
    elevation: 3,
    width: "45%",
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
