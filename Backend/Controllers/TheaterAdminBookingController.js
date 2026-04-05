// // backend/controllers/bookingController.js
// import Booking from "../Models/TheaterAdminBookingModel.js";

// // @desc    Get all bookings
// // @route   GET /api/bookings
// // @access  Public/Admin
// export const getBookings = async (req, res) => {
//   try {
//     const bookings = await Booking.find().sort({ createdAt: -1 });
//     res.status(200).json(bookings);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// // @desc    Create a new booking
// // @route   POST /api/bookings
// // @access  Public/Admin
// export const createBooking = async (req, res) => {
//   const { userName, movieTitle, showTime, seats, amount } = req.body;

//   if (!userName || !movieTitle || !showTime || !seats || !amount) {
//     return res.status(400).json({ message: "Please provide all fields" });
//   }

//   try {
//     const newBooking = await Booking.create({
//       userName,
//       movieTitle,
//       showTime,
//       seats,
//       amount,
//     });

//     res.status(201).json(newBooking);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// // @desc    Delete a booking
// // @route   DELETE /api/bookings/:id
// // @access  Public/Admin
// export const deleteBooking = async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id);
//     if (!booking) return res.status(404).json({ message: "Booking not found" });

//     await booking.remove();
//     res.status(200).json({ message: "Booking deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };
