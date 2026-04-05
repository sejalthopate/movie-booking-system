import Seat from "../Models/TheatreAdminSeatModel.js";

/* CREATE SEATS */
export const createSeats = async (req, res) => {
  try {
    const { theatreName, screenNumber, seats } = req.body;

    if (!theatreName || !screenNumber || !seats?.length) {
      return res.status(400).json({ message: "All fields required" });
    }

    const seatDocs = seats.map((s) => ({
      theatreName,
      screenNumber,
      row: s.row,
      seatNumber: s.seatNumber,
      category: s.category,
      price: s.price,
    }));

    await Seat.insertMany(seatDocs);

    res.status(201).json({ message: "Seats created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* GET SEATS */
export const getSeats = async (req, res) => {
  try {
    const { theatreName, screenNumber } = req.query;

    const seats = await Seat.find({ theatreName, screenNumber });
    res.json(seats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* BOOK SEAT */
export const bookSeat = async (req, res) => {
  try {
    const { seatId } = req.params;

    const seat = await Seat.findById(seatId);
    if (!seat) return res.status(404).json({ message: "Seat not found" });

    if (seat.status === "booked") {
      return res.status(400).json({ message: "Seat already booked" });
    }

    seat.status = "booked";
    await seat.save();

    res.json({ message: "Seat booked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
