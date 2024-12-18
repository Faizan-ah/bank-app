import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, ActivityIndicator } from "react-native";
import { validateToken } from "@/utils/validate";
import { getItem } from "@/utils/storage";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await getItem("authToken");

        if (!token) {
          router.push("/login");
          return;
        }

        const isTokenValid = await validateToken();
        console.log(isTokenValid);
        if (isTokenValid) {
          router.push("/home");
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return null;
};

export default Index;
