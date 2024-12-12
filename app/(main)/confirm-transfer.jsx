import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { TextInput } from "@/components/TextInput";
import SwipeButton from "rn-swipe-button";
import * as LocalAuthentication from "expo-local-authentication";
import AwesomeAlert from "react-native-awesome-alerts";

const ConfirmTransfer = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [resetSwipe, setResetSwipe] = useState(false);
  const methods = useForm({
    defaultValues: {
      message: "",
    },
  });
  const router = useRouter();
  const { name, avatarUrl, account, amount, tax } = useLocalSearchParams();

  const handleBackPress = () => {
    router.back();
  };

  const handleSwipe = async () => {
    try {
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: "Confirm Transfer with Fingerprint",
        fallbackLabel: "Enter password",
      });

      if (biometricAuth.success) {
        console.log({
          message: methods.getValues("message"),
          amount,
          account,
        });
        router.push("/transfer-success");
      } else {
        console.log("here");
        setShowAlert(true);
        setResetSwipe(true);
      }
    } catch (error) {
      setShowAlert(true);
      setResetSwipe(true);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Pressable onPress={handleBackPress} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color="white" />
            </Pressable>
            <Text style={styles.heading}>Confirm Transfer</Text>
          </View>

          <View style={styles.content}>
            <Image
              source={{
                uri:
                  avatarUrl ||
                  `https://ui-avatars.com/api/?name=${"dm"}&background=random`,
              }}
              style={styles.avatar}
            />
            <Text style={styles.name}>{"dummy name"}</Text>
            <Text style={styles.account}>{"dummy account number"}</Text>
            <Text style={styles.amount}>$235.05</Text>
            <Text style={styles.account}>Transfer charges: $0.25</Text>

            <FormProvider {...methods}>
              <Text style={styles.label}>Message/Reference?</Text>
              <TextInput
                name="message"
                style={styles.input}
                placeholderTextColor="blue"
                multiline
              />
            </FormProvider>
          </View>

          <View style={styles.swipeContainer}>
            <SwipeButton
              thumbIconBackgroundColor="#ffffff"
              thumbIconBorderColor="#007bff"
              thumbIconComponent={() => (
                <MaterialIcons name="chevron-right" size={24} color="#007bff" />
              )}
              onSwipeSuccess={handleSwipe}
              containerStyles={styles.swipeButtonContainer}
              railBackgroundColor="#007bff"
              title="Send"
              titleStyles={styles.titleStyle}
              titleColor="#ffffff"
              titleFontSize={18}
              shouldResetAfterSuccess={resetSwipe}
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Authentication Failed"
        titleStyle={{ color: "red", fontWeight: "bold" }}
        message="Fingerprint authentication failed. Please try again."
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmButtonStyle={{
          width: "25%",
          paddingLeft: 20,
        }}
        confirmText="OKAY"
        confirmButtonColor="#007bff"
        onConfirmPressed={() => setShowAlert(false)}
      />
    </View>
  );
};

export default ConfirmTransfer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
    paddingVertical: 4,
    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: "#007bff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  account: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  amount: { fontSize: 26, color: "#007bff", fontWeight: "bold" },
  label: {
    width: "100%",
    color: "#007bff",
  },
  input: {
    width: "100%",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "white",
    fontSize: 16,
  },
  swipeContainer: {
    marginTop: 20,
    width: "100%",
    padding: 10,
  },
  swipeButtonContainer: {
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    padding: 5,
    marginRight: 55,
    borderWidth: 0,
  },
  titleStyle: { fontWeight: "bold" },
});
