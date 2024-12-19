import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { Alert, BackHandler } from "react-native";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
        listeners={{
          beforeRemove: (e) => {
            e.preventDefault();
            // Show confirmation before exiting the app
            Alert.alert("Exit App", "Are you sure you want to exit the app?", [
              {
                text: "Cancel",
                style: "cancel",
              },
              { text: "Yes", onPress: () => BackHandler.exitApp() },
            ]);
          },
        }}
      />
      <Tabs.Screen
        name="request"
        options={{
          title: "Requests",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="swap-vertical" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="user-profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="account-circle" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
