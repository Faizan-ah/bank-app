import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

const RequestsList = () => {
  const router = useRouter();

  // Sample data for requests (you can replace this with dynamic data from an API or context)
  const requests = [
    {
      id: "1",
      senderName: "John Doe",
      amount: 450.0,
      status: "Pending",
      accountNo: "+358 123 4567",
      transferCost: 0.05,
    },
    {
      id: "2",
      senderName: "Jane Smith",
      amount: 350.0,
      status: "Pending",
      accountNo: "+358 987 6543",
      transferCost: 0.02,
    },
  ];

  // Navigate to Transfer Request Approval screen
  const handleRequestClick = (request) => {
    router.push({
      pathname: "/request-approval",
      params: {
        senderName: request.senderName,
        amount: request.amount,
        accountNo: request.accountNo,
        status: request.status,
        transferCost: request.transferCost,
      },
    });
  };

  // Render each request item in the list
  const renderRequestItem = ({ item }) => (
    <View style={styles.requestItem}>
      <Text style={styles.senderName}>{item.senderName}</Text>
      <Text style={styles.amount}>Amount: {item.amount}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>

      <TouchableOpacity
        style={styles.viewDetailsButton}
        onPress={() => handleRequestClick(item)}
      >
        <Text style={styles.viewDetailsButtonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Requests Sent To You</Text>

      <FlatList
        data={requests}
        renderItem={renderRequestItem}
        keyExtractor={(item) => item.id}
        style={styles.requestList}
      />
    </View>
  );
};

export default RequestsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  requestItem: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  senderName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  amount: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
  },
  status: {
    fontSize: 14,
    color: "#6c757d",
    marginTop: 5,
  },
  viewDetailsButton: {
    marginTop: 10,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  viewDetailsButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  requestList: {
    marginTop: 20,
  },
});
