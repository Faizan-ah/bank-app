import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable, BackHandler } from "react-native";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";

const RequestSuccess = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/home");
  };

  useEffect(() => {
    const backAction = () => {
      router.push("/home");
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <LottieView
          source={require("@/assets/images/request-success.json")}
          autoPlay
          loop={false}
          style={styles.animation}
        />
      </View>
      <Text style={styles.title}>Success</Text>
      <Text style={styles.label}>Request Sent Successfully</Text>
      <Pressable style={styles.button} onPress={handleGoBack}>
        <Text style={styles.buttonText}>Go Back</Text>
      </Pressable>
    </View>
  );
};

export default RequestSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fbfc",
    padding: 20,
  },
  iconContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: "#6c757d",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    width: "50%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  animation: {
    width: 200,
    height: 200,
  },
});
