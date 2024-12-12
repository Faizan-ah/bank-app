import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

const Home = () => {
  const router = useRouter();

  const handleSendMoney = () => {
    router.push("/send-money");
  };

  const handleRequestMoney = () => {
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
    maxWidth: 350,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
