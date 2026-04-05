import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/theatres",
});

// Get all theaters
export const getTheatres = () => API.get("/get-theatre");

// Add new theater
export const addTheatres = (data) => API.post("/add-theatre", data);

// Update theater
export const updateTheatre = (id, data) =>
  API.put(`/update-theatre/${id}`, data);

// Delete theater
export const deleteTheatre = (id) =>
  API.delete(`/delete-theatre/${id}`);
