import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { getAllRequests } from "@/services/requestService";
import { ActivityIndicator } from "react-native";

const RequestsList = () => {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const requests = await getAllRequests();
      setRequests(requests.requests);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching requests:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRequests();
    setRefreshing(false);
  };

  // Navigate to Transfer Request Approval screen
  const handleRequestClick = (request) => {
    router.push({
      pathname: "/request-approval",
      params: {
        requestId: request.id,
        senderName: request.requester_name,
        amount: request.amount,
        accountNo: request.account_number,
        status: request.status,
        transferCost: 0,
      },
    });
  };

  // Render each request item in the list
  const renderRequestItem = ({ item }) => (
    <View style={styles.requestItem}>
      <Text style={styles.senderName}>{item.requester_name}</Text>
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
  if (loading) {
    return (
      <View style={{ ...styles.container, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Requests</Text>

      <FlatList
        data={requests}
        renderItem={renderRequestItem}
        keyExtractor={(item) => item.id}
        style={styles.requestList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>No pending requests.</Text>
        }
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
    backgroundColor: "#f1f5f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
  emptyMessage: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#6c757d",
  },
});
