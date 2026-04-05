import express from "express";
import Booking from "../Models/Booking.js";

const router = express.Router();

router.get("/ta-overview", async (req, res) => {
  try {
    const { startDate, endDate, movieId } = req.query;

    let filter = {};

    // ✅ DATE FILTER (STRING MATCH - FINAL FIX)
    if (startDate && endDate) {
      filter.date = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    // ✅ MOVIE FILTER
    if (movieId) {
      filter.movieId = movieId;
    }

    console.log("FILTER:", filter);

    const bookings = await Booking.find(filter);

    console.log("BOOKINGS FOUND:", bookings.length);

    // ✅ TOTAL BOOKINGS
    const totalBookings = bookings.length;

    // ✅ TOTAL REVENUE (IMPORTANT FIX)
    const totalRevenue = bookings.reduce(
      (acc, b) => acc + (b.totalAmount || 0),
      0
    );

    // ✅ UNIQUE SHOWS
    const uniqueShows = new Set(
      bookings.map((b) => `${b.movieId}-${b.date}-${b.time}`)
    );

    const totalShows = uniqueShows.size;

    // ✅ TOTAL SEATS
    const totalSeatsBooked = bookings.reduce(
      (acc, b) => acc + (b.seats?.length || 0),
      0
    );

    // ✅ OCCUPANCY
    const seatOccupancy =
      totalShows > 0
        ? (totalSeatsBooked / (totalShows * 100)) * 100
        : 0;

    res.json({
      totalBookings,
      totalRevenue,
      totalShows,
      seatOccupancy,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;