import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

const Home = () => {
  const router = useRouter();

  const handleSendMoney = () => {
    // Navigate to Send Money Screen (create this screen separately)
    router.push("/send-money");
  };

  const handleRequestMoney = () => {
    // Navigate to Receive Money Screen (create this screen separately)
    router.push("/request-money");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to Your Bank</Text>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>Available Balance</Text>
        <Text style={styles.balanceAmount}>$5,000.00</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={handleSendMoney}>
          <Text style={styles.buttonText}>Send Money</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={handleRequestMoney}>
          <Text style={styles.buttonText}>Request Money</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f4f8",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  balanceContainer: {
    marginVertical: 20,
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  balanceText: {
    fontSize: 18,
    color: "#555",
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2c3e50",
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 30,
    width: "100%",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
