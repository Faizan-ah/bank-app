import axios from "axios";
import { getItem } from "../utils/storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getUser = async () => {
  try {
    const token = await getItem("authToken");
    const response = await axios.get(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.user;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
