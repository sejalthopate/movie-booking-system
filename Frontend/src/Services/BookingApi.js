import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/bookings",
});

// Admin fetch booked seats by date + time
export const getBookedSeats = (params) => {
  if (params.time) params.time = encodeURIComponent(params.time);
  return API.get("/get-seats", { params });
};

// User booking (create)
export const bookSeats = (data) => API.post("/create-booking", data);
