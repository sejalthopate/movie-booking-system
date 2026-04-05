import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/seats",
});

/* ================= FETCH SEATS ================= */
export const fetchSeats = async (theatreId, screen) => {
  try {
    if (!theatreId || !screen) {
      throw new Error("Theatre ID and Screen required");
    }

    const res = await API.get("/get-seats", {
      params: {
        theatreId,
        screen,
      },
    });

    return res.data || { seats: [] };
  } catch (err) {
    console.error("fetchSeats error:", err.message);
    return { seats: [] };
  }
};

/* ================= SAVE SEATS ================= */
export const updateSeats = async (theatreId, screen, seats) => {
  try {
    if (!theatreId || !screen) {
      throw new Error("Theatre ID and Screen required");
    }

    const res = await API.post("/save-seats", {
      theatreId,
      screen,
      seats,
    });

    return res.data;
  } catch (err) {
    console.error("updateSeats error:", err.message);
    throw err;
  }
};
