import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";

const TransferRequestApproval = () => {
  const router = useRouter();
  const { senderName, amount, accountNo, status, transferCost } =
    useLocalSearchParams();
  // Handle Cancel action
  const handleCancel = () => {
    router.push("/home"); // Navigate back to home screen
  };

  // Handle Approve action
  const handleApprove = () => {
    router.push("/transfer-success"); // Navigate to the success page
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transfer Request</Text>

      <View style={styles.card}>
        <View style={styles.recieptHead}>
          <Ionicons
            name="swap-vertical"
            size={68}
            style={styles.icon}
            color={"white"}
          />
          <Text style={styles.successText}>Transfer Request</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.detailsRow}>
          <Text style={styles.label}>Receiver Name:</Text>
          <Text style={styles.value}>{senderName}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.label}>Account No:</Text>
          <Text style={styles.value}>{accountNo}</Text>
        </View>
        {/* <View style={styles.detailsRow}>
          <Text style={styles.label}>Items:</Text>
          <Text style={styles.value}>View Invoice</Text>
        </View> */}
        <View style={styles.detailsRow}>
          <Text style={styles.label}>Amount:</Text>
          <Text style={styles.value}>€{amount}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.label}>Transfer Cost:</Text>
          <Text style={styles.value}>€{transferCost}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.buttonText}>CANCEL</Text>
        </Pressable>

        <Pressable style={styles.approveButton} onPress={handleApprove}>
          <Text style={styles.buttonText}>APPROVE</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default TransferRequestApproval;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9fbfc",
    paddingTop: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#1d2b5f",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 8,
    marginBottom: 40,
    width: "100%",
    justifyContent: "center",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  label: {
    fontSize: 16,
    color: "white",
    marginBottom: 5,
  },
  icon: {
    borderRadius: 50,
    padding: 14,
    backgroundColor: "#007bff",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  approveButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  recieptHead: {
    alignItems: "center",
  },
  animation: {
    width: 100,
    height: 100,
  },
  successText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
    textAlign: "center",
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 20,
  },
});
