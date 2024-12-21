import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { getUser } from "@/services/userService";
import { saveItem } from "@/utils/storage";
import Button from "@/components/Button";

const Home = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserData = async () => {
    try {
      const userData = await getUser();
      await saveItem("user", userData);
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUserData();
  };
  const handleSendMoney = () => {
    router.push("/send-money");
  };

  const handleRequestMoney = () => {
    router.push("/request-money");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Error loading user data.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <Text style={styles.heading}>Welcome to Your Bank</Text>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>Available Balance</Text>
        <Text style={styles.balanceAmount}>${user.balance ?? "0.00"}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Send Money"
          style={styles.button}
          textStyle={styles.buttonText}
          onPress={handleSendMoney}
        />
        <Button
          title="Request Money"
          style={styles.button}
          textStyle={styles.buttonText}
          onPress={handleRequestMoney}
        />
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f1f5f9",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  balanceContainer: {
    marginVertical: 30,
    alignItems: "center",
    padding: 30,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    width: "100%",
    maxWidth: 350,
  },
  balanceText: {
    fontSize: 18,
    color: "#777",
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2c3e50",
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    width: 150,
    height: 70,
  },
  buttonText: {
    fontSize: 18,
    width: 130,
    textAlign: "center",
  },
});
