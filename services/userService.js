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

export const getUserByCredentials = async (body) => {
  const url = `${API_URL}/users/reciever?identifier=${body.identifier}&phone=${body.phone}&account=${body.account}&nin=${body.nin}`;
  try {
    const response = await axios.get(url);
    return response.data.user;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const updateUserProfile = async (body) => {
  try {
    const token = await getItem("authToken");
    const response = await axios.put(`${API_URL}/users`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.user;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
