import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
} from "react-native";
import React from "react";
import bg from "@/assets/images/bg.webp";
import { Link } from "expo-router";

const App = () => {
  return (
    <View style={styles.container}>
      <ImageBackground source={bg} resizeMode="cover" style={styles.image}>
        <Text style={styles.text}>Bank App</Text>
        <Link href="/login" style={{ marginHorizontal: "auto" }} asChild>
          <Pressable style={styles.button}>
            <Text style={{ ...styles.text, fontSize: 22 }}>Login</Text>
          </Pressable>
        </Link>
      </ImageBackground>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
  },
  link: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    padding: 4,
  },
  image: {
    width: "100%",
    height: "100%",
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  button: {
    borderRadius: 10,
    border: "1px solid black",
    height: 50,
    padding: 10,
    justifyContent: "center",
    backgroundColor: "blue",
  },
});
