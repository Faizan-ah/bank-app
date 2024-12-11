import React from "react";
import { Slot, Stack } from "expo-router";

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen name="(home)" options={{ headerShown: false }} />
      <Stack.Screen name="send-money" options={{ headerShown: false }} />
      <Stack.Screen name="confirm-transfer" options={{ headerShown: false }} />
      <Stack.Screen name="transfer-success" options={{ headerShown: false }} />
      <Stack.Screen name="contacts" options={{ headerShown: false }} />
    </Stack>
  );
}
