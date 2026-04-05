import Seat from "../Models/SeatModel.js";
import Booking from "../Models/Booking.js";

// GET seats with booked info
export const getSeatsByShow = async (req, res) => {
  try {
    const { movieId, theatreId, screenId, date, time } = req.query;


    if (!movieId || !theatreId || !date || !time) {
      return res.status(400).json({ message: "Missing query params" });
    }

    // 1️⃣ Get all seats for this show
  let seats = await Seat.find({ movieId, theatreId, screenId, date, time })


    // If seats not created yet, generate default
    if (seats.length === 0) {
      const rows = ["A","B","C","D","E"];
      const seatDocs = [];
      rows.forEach((row) => {
        for (let i = 1; i <= 8; i++) {
         seatDocs.push({
  movieId,
  theatreId,
  screenId,
  date,
  time,
  number: row + i,
  isBooked: false
});

        }
      });
      seats = await Seat.insertMany(seatDocs);
    }

    // 2️⃣ Get all bookings for this show
    const bookings = await Booking.find({ movieId, theatreId, date, time });
    const bookedSeats = bookings.flatMap(b => b.seats); // e.g. ["A1","B3"]

    // 3️⃣ Mark seats as booked if booked in Booking collection or Seat collection
    seats = seats.map(seat => ({
      ...seat._doc,
      isBooked: seat.isBooked || bookedSeats.includes(seat.number)
    }));

    res.status(200).json(seats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// BOOK seats via SeatController (optional if you book via BookingController)
export const bookSeats = async (req, res) => {
  try {
    const { movieId, theatreId, date, time, seats } = req.body;

    if (!seats || seats.length === 0) {
      return res.status(400).json({ message: "No seats selected" });
    }

    const alreadyBooked = await Seat.find({
      movieId,
      theatreId,
      date,
      time,
      number: { $in: seats },
      isBooked: true,
    });

    if (alreadyBooked.length > 0) {
      return res.status(409).json({ message: "Some seats already booked" });
    }

    await Seat.updateMany(
      { movieId, theatreId, date, time, number: { $in: seats } },
      { $set: { isBooked: true } }
    );

    res.status(200).json({ message: "Seats booked successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
