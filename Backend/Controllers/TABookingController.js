import Booking from "../Models/TAbooking.js";

/**
 * USER BOOKS SEATS
 * ----------------
 * Body:
 * userId, theatreId, movieId, date, time, seats[]
 */
export const createBooking = async (req, res) => {
  try {
    const { userId, theatreId, movieId, date, time, seats } = req.body;

    if (
      !userId ||
      !theatreId ||
      !movieId ||
      !date ||
      !time ||
      !seats ||
      seats.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "All booking fields are required",
      });
    }

    const newBooking = new Booking({
      userId,
      theatreId,
      movieId,
      date,
      time,
      seats,
    });

    await newBooking.save();

    res.status(201).json({
      success: true,
      message: "Booking successful",
      booking: newBooking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error creating booking",
      error: err.message,
    });
  }
};

/**
 * ADMIN / USER – FETCH BOOKED SEATS
 * --------------------------------
 * Query Params: theatreId, movieId, date, time
 * Returns: bookedSeats array for that date + time
 */
export const getBookedSeats = async (req, res) => {
  try {
    const { theatreId, movieId, date, time } = req.query;

    if (!theatreId || !movieId || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "All query params required",
      });
    }

    // 1️⃣ Fetch all bookings for that theatre + movie + date
    const bookings = await Booking.find({
      theatreId,
      movieId,
      date,
    });

    // 2️⃣ Normalize time to avoid mismatch (spaces, AM/PM case)
    const normalizeTime = (t) => t.replace(/\s+/g, "").toLowerCase();

    // 3️⃣ Filter bookings by exact time match
    const filteredBookings = bookings.filter(
      (b) => normalizeTime(b.time) === normalizeTime(time)
    );

    // 4️⃣ Flatten all booked seats
    const bookedSeats = filteredBookings.flatMap((b) => b.seats);

    res.status(200).json({
      success: true,
      bookedSeats,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching booked seats",
      error: err.message,
    });
  }
};

/**
 * ADMIN – FETCH ALL BOOKINGS (Booking Management Table)
 */
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: bookings.length,
      bookings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching bookings",
      error: err.message,
    });
  }
};

/**
 * ADMIN – CANCEL BOOKING
 * ----------------------
 * Params: bookingId
 */
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findByIdAndDelete(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error cancelling booking",
      error: err.message,
    });
  }
};
