import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/tabookings",
});

/* ===============================
   USER SIDE – BOOK SEATS
================================ */
export const bookSeats = (bookingData) => {
  return API.post("/book", bookingData);
};

/* ===============================
   ADMIN / USER – FETCH BOOKED SEATS
================================ */
export const getBookedSeats = (params) => {
  return API.get("/seats", { params });
};

/* ===============================
   (OPTIONAL) ADMIN – FETCH ALL BOOKINGS
================================ */
export const getAllBookings = () => {
  return API.get("/all");
};
