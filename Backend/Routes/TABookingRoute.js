import express from "express";
import { createBooking, getBookedSeats } from "../Controllers/TABookingController.js";

const router = express.Router();

// User books tickets
router.post("/book", createBooking);

// Admin fetch booked seats
router.get("/seats", getBookedSeats);

export default router;
