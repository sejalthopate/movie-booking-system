import axios from "axios";

export const getMovieCoupons = (theatreId, movieId) => {
  return axios.get(
    `http://localhost:5000/api/coupons/${theatreId}/${movieId}`
  );
};
