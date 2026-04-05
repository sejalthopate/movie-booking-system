import axios from "axios";

// Backend base URL
const BASE_URL = "http://localhost:5000/api/payments";

export const createPayment = async (amount) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/create-payment`, { amount });
    return data;
  } catch (err) {
    console.error("Error creating payment:", err);
    throw err;
  }
};

export const verifyPayment = async (paymentDetails) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/verify-payment`, paymentDetails);
    return data;
  } catch (err) {
    console.error("Error verifying payment:", err);
    throw err;
  }
};
