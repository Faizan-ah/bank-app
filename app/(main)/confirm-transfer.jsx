import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { TextInput } from "@/components/TextInput";
import SwipeButton from "rn-swipe-button";
import * as LocalAuthentication from "expo-local-authentication";
// import AwesomeAlert from "react-native-awesome-alerts";
import { getUserByCredentials } from "@/services/userService";
import { transferMoney } from "@/services/transferService";
import { getItem } from "@/utils/storage";
const ConfirmTransfer = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [resetSwipe, setResetSwipe] = useState(false);
  const methods = useForm({
    defaultValues: {
      message: "",
    },
  });
  const router = useRouter();
  const {
    recipientIdentifierType,
    recipientIdentifier,
    avatarUrl,
    amount,
    recieverName,
    recieverAccount,
  } = useLocalSearchParams();

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
        const user = await getItem("user");
        const transferData = {
          senderId: user.id,
          recipientIdentifier,
          recipientIdentifierType,
          amount: Number(amount),
          message: methods.getValues("message"),
        };
        const response = await transferMoney(transferData);
        if (response.status === 200) {
          const data = response.data.transactionInfo;
          router.push({
            pathname: "/transfer-success",
            params: {
              name: data.recipient.first_name + " " + data.recipient.last_name,
              transactionId: data.id,
              amount: data.amount,
              transactionDate: data.transactionDate,
            },
          });
        }
      } else {
        setShowAlert(true);
        Alert.alert(
          "Authentication Failed",
          "Fingerprint authentication failed. Please try again."
        );
        setResetSwipe(true);
      }
    } catch (error) {
      console.error(error);
      setShowAlert(true);
      Alert.alert(
        "Authentication Failed",
        "Fingerprint authentication failed. Please try again."
      );
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
                  (recieverName
                    ? `https://ui-avatars.com/api/?name=${recieverName}&background=random`
                    : "default-avatar-url"),
              }}
              style={styles.avatar}
            />
            <Text style={styles.name}>{recieverName ?? "-"}</Text>
            <Text style={styles.account}>{recieverAccount ?? "-"}</Text>
            <Text style={styles.amount}>${amount}</Text>
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
              railStyles={styles.railStyles}
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* <AwesomeAlert
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
      /> */}
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
    backgroundColor: "#4E63BC",
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
    padding: 10,
    marginRight: 55,
    borderWidth: 0,
    backgroundColor: "red",
  },
  titleStyle: { fontWeight: "bold" },
  railStyles: { backgroundColor: "transparent", borderWidth: 0 },
});
