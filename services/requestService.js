import { getItem } from "@/utils/storage";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const requestMoney = async (body) => {
  try {
    const token = await getItem("authToken");
    const response = await axios.post(`${API_URL}/request-money`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
