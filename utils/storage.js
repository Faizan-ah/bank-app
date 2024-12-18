import * as SecureStore from "expo-secure-store";

export const saveItem = async (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    await SecureStore.setItemAsync(key, serializedValue);
  } catch (error) {
    console.error(`Error saving item with key ${key}:`, error);
  }
};

export const getItem = async (key) => {
  try {
    const serializedValue = await SecureStore.getItemAsync(key);
    return serializedValue ? JSON.parse(serializedValue) : null;
  } catch (error) {
    console.error(`Error getting item with key ${key}:`, error);
    return null;
  }
};

export const removeItem = async (key) => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error(`Error removing item with key ${key}:`, error);
  }
};
