import axios from "axios";

const BASE_URL = "http://localhost:5000/api/admin";

// 📥 Get all users
export const getAdminUsers = () => {
  return axios.get(`${BASE_URL}/get-users`);
};

// 🚫 Block / Unblock user
export const toggleBlockUser = (userId) => {
  return axios.put(`${BASE_URL}/block-user/${userId}`);
};
