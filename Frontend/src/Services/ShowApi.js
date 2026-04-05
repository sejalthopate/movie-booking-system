import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/shows",
});

// Get all shows
export const getShows = () => API.get("/get-show");

// Add show
export const addShow = (data) => API.post("/add-show", data);

// Update show
export const updateShow = (id, data) => API.put(`/update-show/${id}`, data);

// Delete show
export const deleteShow = (id) => API.delete(`/delete-show/${id}`);