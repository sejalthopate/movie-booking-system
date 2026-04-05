import axios from "axios";

const BASE_URL = "http://localhost:5000/api/movies";

export const addMovieApi = (movieData) => axios.post(`${BASE_URL}/add-movie`, movieData);
export const getMoviesApi = () => axios.get(`${BASE_URL}/get-movie`);
export const updateMovieApi = (id, movieData) => axios.put(`${BASE_URL}/update-movie/${id}`, movieData);
export const deleteMovieApi = (id) => axios.delete(`${BASE_URL}/delete-movie/${id}`);
