import axios from "axios";

const API = "http://localhost:5000/api/seats";

// GET seats
export const getSeats = (params) =>
  axios.get(API, { params });

// BOOK seats
export const bookSeats = (data) =>
  axios.post(`${API}/book`, data);
