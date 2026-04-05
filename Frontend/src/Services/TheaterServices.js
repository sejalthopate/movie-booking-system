import axios from "axios";

export const getMoviesByTheatre = async (theatreId) => {
  return await axios.get(`/api/movies/theatre/${theatreId}`);
};
