import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { approveRequest, declineRequest } from "@/services/requestService";

const TransferRequestApproval = () => {
  const router = useRouter();
  const { requestId, senderName, amount, accountNo, status, transferCost } =
    useLocalSearchParams();
  const [loadingDecline, setLoadingDecline] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);

  const handleBackPress = () => {
    router.back();
  };

  // Handle Cancel action
  const handleCancel = async () => {
    try {
      setLoadingDecline(true);
      await declineRequest({ requestId });
      setLoadingDecline(false);
      router.push("/request");
    } catch (error) {
      setLoadingDecline(false);
      alert(error.message || "Something went wrong. Please try again.");
    }
  };

  // Handle Approve action
  const handleApprove = async () => {
    try {
      setLoadingApprove(true);
      const request = await approveRequest({ requestId });
      setLoadingApprove(false);
      console.log(request.transaction);
      router.push({
        pathname: "/transfer-success",
        params: {
          name: senderName,
          transactionId: request.transaction.id,
          amount: amount,
          transactionDate: request.transaction.transaction_date,
        },
      });
    } catch (error) {
      setLoadingApprove(false);
      alert(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleBackPress} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text style={styles.heading}>Transfer Request</Text>
      </View>

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
          <Text style={styles.value}>${amount}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.label}>Transfer Cost:</Text>
          <Text style={styles.value}>${transferCost}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={
            !loadingDecline
              ? styles.cancelButton
              : { ...styles.cancelButton, backgroundColor: "grey" }
          }
          disabled={loadingDecline}
          onPress={handleCancel}
        >
          {loadingDecline ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.buttonText}>DECLINE</Text>
          )}
        </Pressable>

        <Pressable
          style={
            !loadingApprove
              ? styles.approveButton
              : { ...styles.approveButton, backgroundColor: "grey" }
          }
          disabled={loadingApprove}
          onPress={handleApprove}
        >
          {loadingApprove ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.buttonText}>APPROVE</Text>
          )}
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
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    paddingLeft: 10,
    paddingBottom: 2,
  },
  backButton: {
    marginRight: 10,
    paddingVertical: 4,
    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: "#007bff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 40,
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
    backgroundColor: "red",
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
