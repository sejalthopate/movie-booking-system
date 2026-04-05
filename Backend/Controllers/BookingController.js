import Booking from "../Models/Booking.js";
import Seat from "../Models/SeatModel.js";

// ================= User Side: CREATE Booking =================
export const createBooking = async (req, res) => {
  
  try {
    const { movieId, theatreId, date, time, seats, userId, totalAmount } = req.body;

    if (!seats || seats.length === 0)
      return res.status(400).json({ message: "No seats selected" });

    // Check already booked in Seat collection
   const alreadyBookedSeats = await Seat.find({
  movieId,
  theatreId,
 
  date,
  time,
  number: { $in: seats },
  isBooked: true
});

    // Check already booked in Booking collection
  // Check already booked in Booking collection
const existingBookings = await Booking.find({
  movieId, theatreId,  date, time
});

const bookedSeats = existingBookings.flatMap(b => b.seats);

const conflict = seats.filter(seat => bookedSeats.includes(seat));

if (conflict.length > 0) {
  return res.status(409).json({ message: "Some seats already booked" });
}


    // 1️⃣ Create booking
   // 1️⃣ Create booking
const booking = await Booking.create({
  movieId,
  theatreId,
  date,
  time,
  seats,
  userId,
  totalAmount,
  paymentStatus: "Success"
});

// 2️⃣ Update Seat collection
await Seat.updateMany(
  { movieId, theatreId, date, time, number: { $in: seats } },
  { $set: { isBooked: true } }
);


    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= Admin Side: GET Already Booked Seats =================
export const getBookedSeats = async (req, res) => {
  try {
    let { movieId, theatreId, date, time } = req.query;

    if (!date || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    date = date.trim();
    time = decodeURIComponent(time.trim());

    const filter = { date, time };
    if (movieId) filter.movieId = movieId;
    if (theatreId) filter.theatreId = theatreId;
    

    const bookings = await Booking.find(filter);

    // Send booked seat IDs as strings like "A1", "B5"
    const seats = bookings.flatMap(b => b.seats.map(s => `${s.row}${s.number}`));

    res.json(seats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body; // Comes from MyBookings.jsx (role: "User")

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { 
        bookingStatus: "Cancelled",
        cancelledBy: role 
      },
      { new: true }
    );

    res.status(200).json(updatedBooking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find bookings for this user and "populate" details so we get movie title/poster
    const bookings = await Booking.find({ userId: userId })
      .populate("movieId") 
      .populate("theatreId")
      .sort({ createdAt: -1 }); // Show newest first

    if (!bookings || bookings.length === 0) {
      return res.status(200).json([]); // Return empty array instead of 404
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
// Add this to your existing BookingController.js
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email")    // Fetches name and email from User model
      .populate("movieId", "title")        // Fetches title from Movie model
      .populate("theatreId", "name")       // Fetches name from Theatre model
      .sort({ createdAt: -1 });            // Shows newest bookings first

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
