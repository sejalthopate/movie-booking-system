import axios from "axios";

const BASE_URL = "http://localhost:5000/api/coupon";

// GET coupons for a theatre & movie
export const getCoupons = (theatreId, movieId) =>
  axios.get(`${BASE_URL}/get-coupon/${theatreId}/${movieId}`);

// CREATE new coupon
export const createCoupon = (data) =>
  axios.post(`${BASE_URL}/add-coupon`, data);

// DELETE coupon
export const deleteCoupon = (id) =>
  axios.delete(`${BASE_URL}/delete-coupon/${id}`);

// UPDATE coupon
export const updateCoupon = (id, data) =>
  axios.put(`${BASE_URL}/update-coupon/${id}`, data);
