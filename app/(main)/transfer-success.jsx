import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Share,
  BackHandler,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native"; // For animated checkmark
import { captureRef } from "react-native-view-shot"; // Import the captureRef function
import * as FileSystem from "expo-file-system"; // For handling file storage
import * as Sharing from "expo-sharing"; // For sharing images
import { convertTimeZoneToDateFormat } from "@/utils/date";
const TransferSuccess = () => {
  const router = useRouter();
  const [imageUri, setImageUri] = useState(null); // State to store the captured image URI
  const receiptRef = useRef(); // Ref to capture the receipt card
  const { name, transactionId, amount, transactionDate } =
    useLocalSearchParams();

  // Function to capture the view as an image
  const captureReceipt = async () => {
    try {
      const uri = await captureRef(receiptRef, {
        format: "png", // Set the image format (png or jpg)
        quality: 0.8, // Set image quality (0 to 1)
      });

      // Make sure the file is saved in a shareable location
      const fileUri = FileSystem.documentDirectory + "transfer_receipt.png";
      await FileSystem.moveAsync({
        from: uri,
        to: fileUri,
      });

      setImageUri(fileUri); // Save the captured URI in the state
      console.log("Receipt captured and saved to:", fileUri);

      // After saving the image, share it
      handleShare(fileUri); // Pass the saved image URI to handleShare()
    } catch (error) {
      console.error("Error capturing receipt:", error.message);
    }
  };

  const handleShare = async (fileUri) => {
    if (fileUri) {
      try {
        // Use expo-sharing to share the image
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        } else {
          console.log("Sharing is not available on this device.");
        }
      } catch (error) {
        console.error("Error sharing image: ", error.message);
      }
    } else {
      console.log("Image not available for sharing.");
    }
  };

  const handleBack = () => {
    router.push("/home"); // Navigate back to home or another screen
  };

  useEffect(() => {
    const backAction = () => {
      handleBack();
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
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text style={styles.heading}>Success</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card} ref={receiptRef}>
          <View style={styles.recieptHead}>
            <LottieView
              source={require("@/assets/images/success-check.json")}
              autoPlay
              loop={false}
              style={styles.animation}
            />
            <Text style={styles.successText}>Transferred Successfully</Text>
          </View>
          <View style={styles.separator} />

          {/* Transfer Details Card */}
          <View style={styles.detailsRow}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{name}</Text>
          </View>

          <View style={styles.detailsRow}>
            <Text style={styles.label}>Transaction ID</Text>
            <Text
              style={[styles.value, { maxWidth: 150, textAlign: "right" }]}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {transactionId}
            </Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.label}>Amount</Text>
            <Text style={styles.value}>${amount}</Text>
          </View>

          <View style={styles.detailsRow}>
            <Text style={styles.label}>Transfer Cost</Text>
            <Text style={styles.value}>$0.25</Text>
          </View>

          <View style={styles.detailsRow}>
            <Text style={styles.label}>Time & Date</Text>
            <Text style={styles.value}>
              {convertTimeZoneToDateFormat(transactionDate)}
            </Text>
          </View>
        </View>
      </View>

      {/* Capture and Share Button */}
      <Pressable
        onPress={() => {
          captureReceipt();
        }}
        style={styles.shareButton}
      >
        <MaterialIcons name="share" size={20} color="white" />
        <Text style={styles.shareText}>Share </Text>
      </Pressable>
    </View>
  );
};

export default TransferSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  recieptHead: {
    alignItems: "center",
  },
  backButton: {
    marginRight: 10,
    paddingVertical: 4,
    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: "#4E63BC",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  animation: {
    width: 100,
    height: 100,
  },
  successText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginVertical: 10,
    textAlign: "center",
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#1d2b5f",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
    overflow: "hidden",
  },
  label: {
    fontSize: 14,
    color: "white",
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 25,
    marginBottom: 80,
    width: "40%",
    marginHorizontal: "auto",
  },
  shareText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    marginLeft: 10,
  },
});
