import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import { MaterialIcons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import { useLocalSearchParams, useRouter } from "expo-router";
import { TextInput } from "@/components/TextInput";
import AwesomeAlert from "react-native-awesome-alerts";

const SendMoney = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const methods = useForm({
    defaultValues: {
      amount: "",
      number: "",
      accountNumber: "",
      nin: "",
    },
  });
  const router = useRouter();
  const { phoneNumber, amount } = useLocalSearchParams();
  const availableBalance = "₦285,856.20";

  useEffect(() => {
    if (phoneNumber) {
      setSelectedMethod("phone");
      methods.setValue("number", phoneNumber);
      methods.setValue("amount", amount);
    }
  }, [phoneNumber]);

  const handleSelectContact = () => {
    router.push({
      pathname: "/contacts",
      params: {
        returnTo: "send-money",
        amount: methods.getValues("amount"),
      },
    });
  };

  const onSubmit = (data) => {
    console.log(data);
    if (selectedMethod) {
      router.push("/confirm-transfer");
    } else {
      setShowAlert(true); // Show alert when no method is selected
    }
  };

  const onError = (error) => {
    console.log(error);
  };

  const handleBackPress = () => {
    router.push("/home");
  };

  const handleMethodChange = (value) => {
    const amount = methods.getValues("amount");
    setSelectedMethod(value);

    if (value === "phone") {
      methods.setValue("accountNumber", "");
      methods.setValue("nin", "");
    } else if (value === "account") {
      methods.setValue("number", "");
      methods.setValue("nin", "");
    } else if (value === "nin") {
      methods.setValue("number", "");
      methods.setValue("accountNumber", "");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <Pressable onPress={handleBackPress} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text style={styles.heading}>Send Money</Text>
      </View>

      <View style={styles.balanceContainer}>
        <Text style={styles.label}>Available Balance</Text>
        <Text style={styles.balance}>{availableBalance}</Text>
      </View>
      <FormProvider {...methods}>
        <TextInput
          name="amount"
          style={styles.input}
          placeholder="Enter Amount"
          keyboardType="numeric"
          rules={{ required: "Amount is required!" }}
        />

        <Text style={{ ...styles.label, marginTop: -4, marginBottom: 10 }}>
          Transfer Charges: 0.046
        </Text>

        <Text style={{ ...styles.label, color: "#007bff", fontWeight: "bold" }}>
          Transfer Method
        </Text>
        <View style={styles.pickerStyles}>
          <RNPickerSelect
            onValueChange={handleMethodChange}
            placeholder={{
              label: "Choose an option",
              value: null,
            }}
            value={selectedMethod}
            items={[
              { label: "Phone Number", value: "phone" },
              { label: "Account Number", value: "account" },
              { label: "NIN", value: "nin" },
            ]}
            style={pickerStyles}
          />
        </View>
        {selectedMethod === "phone" && (
          <View>
            <TextInput
              name="number"
              keyboardType="phone-pad"
              style={styles.input}
              placeholder="Enter phone number"
              rules={{
                required: "Phone number is required!",
              }}
            />
            <TouchableOpacity onPress={handleSelectContact}>
              <Text style={styles.selectContactText}>Select from Contacts</Text>
            </TouchableOpacity>
          </View>
        )}

        {selectedMethod === "account" && (
          <TextInput
            name="accountNumber"
            style={styles.input}
            placeholder="Enter Account Number"
            keyboardType="numeric"
            rules={{ required: "Account number is required!" }}
          />
        )}

        {selectedMethod === "nin" && (
          <TextInput
            name="nin"
            style={styles.input}
            placeholder="Enter NIN"
            keyboardType="numeric"
            rules={{ required: "NIN is required!" }}
          />
        )}
      </FormProvider>
      <Pressable
        style={styles.button}
        onPress={methods.handleSubmit(onSubmit, onError)}
      >
        <Text style={styles.buttonText}>Next</Text>
      </Pressable>

      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="ERROR"
        titleStyle={{ color: "red", fontWeight: "bold" }}
        message="Please choose a transfer method before proceeding!"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#007bff"
        onConfirmPressed={() => setShowAlert(false)}
      />
    </KeyboardAvoidingView>
  );
};

export default SendMoney;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 40,
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
    paddingLeft: 10,
    paddingBottom: 2,
  },
  balanceContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#555",
  },
  balance: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  input: { width: "100%" },

  selectContactText: {
    color: "#007bff",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    width: "50%",
    marginHorizontal: "auto",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  pickerStyles: {
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 10,
    paddingVertical: 2,
    backgroundColor: "white",
    marginBottom: 20,
    fontSize: 10,
  },
});

const pickerStyles = {
  inputIOS: {
    backgroundColor: "transparent",
    fontSize: 16,
  },
  inputAndroid: {
    backgroundColor: "transparent",
    fontSize: 16,
  },
};
