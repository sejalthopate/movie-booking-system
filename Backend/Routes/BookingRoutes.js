import express from "express";
import { getBookedSeats, createBooking ,cancelBooking,getAllBookings,getBookingsByUser} from "../Controllers/BookingController.js";

const bookingRouter = express.Router();

// User creates booking
bookingRouter.post("/create-booking", createBooking);

// Admin fetch booked seats
bookingRouter.get("/get-seats", getBookedSeats);
bookingRouter.put("/cancel/:id", cancelBooking);
bookingRouter.get("/all", getAllBookings);
bookingRouter.get("/user-bookings/:userId", getBookingsByUser);
export default bookingRouter;
