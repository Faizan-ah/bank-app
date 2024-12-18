import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const transferMoney = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/transfer`, data);

    return response;
  } catch (error) {
    // Handle errors (e.g., insufficient funds, recipient not found)
    console.error(
      "Transfer Error 1:",
      error.response ? error.response.data : error.message
    );
    console.error("Transfer Error:", error.response.data.message);
    // Show error alert or message
  }
};
