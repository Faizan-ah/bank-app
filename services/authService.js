import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const login = async (phoneNumber, password) => {
  try {
    console.log(API_URL);
    const response = await axios.post(`${API_URL}/users/login`, {
      phoneNumber,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
