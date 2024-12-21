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
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { TextInput } from "@/components/TextInput";
import { getItem } from "@/utils/storage";
import { getUserByCredentials } from "@/services/userService";
import { NIN_REGEX } from "@/utils/constants";
import Button from "@/components/Button";
import { Alert } from "react-native";

const SendMoney = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [availableBalance, setAvailableBalance] = useState("");

  const methods = useForm({
    defaultValues: {
      amount: "",
      number: "",
      account: "",
      nin: "",
    },
  });
  const router = useRouter();
  const { phoneNumber, amount } = useLocalSearchParams();

  useEffect(() => {
    const currentBalance = async () => {
      try {
        const user = await getItem("user");
        if (!user) throw new Error("User data not found in storage");
        setAvailableBalance(user.balance);
      } catch (error) {
        console.error("Error fetching balance:", error);
        setAvailableBalance("0.00"); // Fallback value
      }
    };
    currentBalance();
  }, []);

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
  const confirmUserExistsAndPush = async () => {
    try {
      const currentInput =
        selectedMethod === "phone" ? "number" : selectedMethod;
      setLoading(true);
      const body = {
        identifier: selectedMethod,
        [selectedMethod]: methods.getValues(currentInput),
      };
      const user = await getUserByCredentials(body);
      setLoading(false);
      router.push({
        pathname: "/confirm-transfer",
        params: {
          recipientIdentifierType: selectedMethod,
          recipientIdentifier: methods.getValues(currentInput),
          amount: methods.getValues("amount"),
          recieverName: user.first_name + " " + user.last_name,
          recieverAccount: user.account_number,
        },
      });
    } catch (error) {
      setLoading(false);
      alert(error.message || "Something went wrong. Please try again.");
    }
  };

  const onSubmit = (data) => {
    if (selectedMethod) {
      confirmUserExistsAndPush();
    } else {
      Alert.alert(
        "ERROR",
        "Please choose a transfer method before proceeding!"
      );
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
      methods.setValue("account", "");
      methods.setValue("nin", "");
    } else if (value === "account") {
      methods.setValue("number", "");
      methods.setValue("nin", "");
    } else if (value === "nin") {
      methods.setValue("number", "");
      methods.setValue("account", "");
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
        <Text style={styles.balance}>
          {availableBalance ? `$${availableBalance}` : "-"}
        </Text>
      </View>
      <FormProvider {...methods}>
        <TextInput
          name="amount"
          style={styles.input}
          placeholder="Enter Amount"
          keyboardType="numeric"
          rules={{
            required: "Amount is required!",
            validate: (value) =>
              Number(value) <= Number(availableBalance) ||
              "Amount cannot be greater than balance!",
          }}
        />

        <Text style={{ ...styles.label, marginTop: -4, marginBottom: 10 }}>
          Transfer Charges: $0.25
        </Text>

        <Text style={{ ...styles.label, color: "#007bff", fontWeight: "bold" }}>
          Transfer Method
        </Text>
        <View style={styles.pickerStyles}>
          <Picker
            selectedValue={selectedMethod}
            onValueChange={handleMethodChange}
            style={pickerStyles}
          >
            {[
              {
                label: "Choose an option",
                value: null,
              },
              { label: "Phone Number", value: "phone" },
              { label: "Account Number", value: "account" },
              { label: "NIN", value: "nin" },
            ].map((item) => (
              <Picker.Item label={item.label} value={item.value} />
            ))}
          </Picker>
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
            name="account"
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
            placeholder="Enter NIN eg. 010199023M"
            onChangeText={(text) => methods.setValue("nin", text.toUpperCase())}
            rules={{
              required: "NIN is required!",
              pattern: {
                value: NIN_REGEX,
                message: "Please enter a valid NIN!",
              },
            }}
          />
        )}
      </FormProvider>
      <View style={styles.buttonContainer}>
        <Button
          title="Next"
          style={{ width: 130 }}
          loading={loading}
          disabled={loading}
          onPress={methods.handleSubmit(onSubmit, onError)}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default SendMoney;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f1f5f9",
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
  buttonContainer: {
    marginTop: 10,
    alignItems: "center",
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
