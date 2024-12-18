import React, { useEffect } from "react";
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
import { useLocalSearchParams, useRouter } from "expo-router";
import { TextInput } from "@/components/TextInput";

const RequestMoney = () => {
  const methods = useForm({
    defaultValues: {
      amount: "",
      number: "",
      item: "",
    },
  });
  const router = useRouter();
  const { phoneNumber, amount } = useLocalSearchParams();

  useEffect(() => {
    if (phoneNumber) {
      methods.setValue("number", phoneNumber);
      methods.setValue("amount", amount);
    }
  }, [phoneNumber]);

  const handleSelectContact = () => {
    router.push({
      pathname: "/contacts",
      params: {
        returnTo: "request-money",
        amount: methods.getValues("amount"),
      },
    });
  };

  const handleBackPress = () => {
    router.push("/home");
  };

  const onSubmit = (data) => {
    router.push("/request-success");
  };

  const onError = (error) => {
    console.log(error);
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
        <Text style={styles.heading}>Request Money</Text>
      </View>

      <FormProvider {...methods}>
        <TextInput
          name="number"
          label="Phone Number"
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          rules={{ required: "Phone number is required!" }}
        />
        <TouchableOpacity onPress={handleSelectContact}>
          <Text style={styles.selectContactText}>Select from Contacts</Text>
        </TouchableOpacity>

        <TextInput
          name="amount"
          label="Amount"
          placeholder="Enter Amount"
          keyboardType="numeric"
          rules={{ required: "Amount is required!" }}
        />
      </FormProvider>

      <Pressable
        style={styles.button}
        onPress={methods.handleSubmit(onSubmit, onError)}
      >
        <Text style={styles.buttonText}>Request</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

export default RequestMoney;

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
  selectContactText: {
    color: "#007bff",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 80,
    width: "50%",
    marginHorizontal: "auto",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
