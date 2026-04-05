import axios from "axios";

const BASE_URL = "http://localhost:5000/api/snacks";

// 📥 Get Snacks
export const getSnacks = () => {
  return axios.get(`${BASE_URL}/get-snack`);
};

// ➕ Add Snack
export const addSnack = (data) => {
  return axios.post(`${BASE_URL}/add-snack`, data);
};

// ✏️ Update Snack
export const updateSnack = (id, data) => {
  return axios.put(`${BASE_URL}/update-snack/${id}`, data);
};

// ❌ Delete Snack
export const deleteSnack = (id) => {
  return axios.delete(`${BASE_URL}/delete-snack/${id}`);
};
