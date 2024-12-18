import { getUser } from "../services/userService"; // API function to check token validity

export const validateToken = async (token) => {
  try {
    const response = await getUser(token);
    return response ? true : false;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
};
