import axios from "axios";

const BASE_URL = "http://localhost:5000/api/SeatShow"; // backend base URL

// Fetch all shows for dropdown
export const getShows = async () => {
  try {
    const res = await axios.get(BASE_URL);
    return res.data;
  } catch (error) {
    console.error("Error fetching shows:", error);
    throw error;
  }
};

// Fetch seats for a specific show
export const getSeatsByShow = async (showId) => {
  try {
    const res = await axios.get(`${BASE_URL}/${showId}/seats`);
    return res.data;
  } catch (error) {
    console.error("Error fetching seats:", error);
    throw error;
  }
};

// Update seat statuses for a specific show
export const updateSeatsByShow = async (showId, seats) => {
  try {
    const res = await axios.put(`${BASE_URL}/${showId}/seats`, { seats });
    return res.data;
  } catch (error) {
    console.error("Error updating seats:", error);
    throw error;
  }
};
