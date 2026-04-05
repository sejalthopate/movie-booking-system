import axios from "axios";

export const createBooking = (data) => {
  return axios.post(
    "http://localhost:5000/api/bookings/create-booking",
    data
  );
};
