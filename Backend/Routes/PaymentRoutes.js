// /Routes/paymentRoutes.js
import express from "express";
import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Test key
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Temporary in-memory booking array
let testBookings = [];

// 1️⃣ Create QR Payment Link
router.post("/create-qr", async (req, res) => {
  const { userName, amount } = req.body;
  const bookingId = "BK" + Date.now();

  testBookings.push({ bookingId, userName, amount, status: "Pending" });

  try {
    const paymentLink = await razorpay.paymentLink.create({
      amount: amount * 100, // paisa
      currency: "INR",
      description: "Movie Ticket Test",
      reference_id: bookingId,
    });

    res.json({
      qrUrl: paymentLink.short_url,
      bookingId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2️⃣ Get Booking Status
router.get("/:bookingId", (req, res) => {
  const booking = testBookings.find(b => b.bookingId === req.params.bookingId);
  if (!booking) return res.status(404).json({ error: "Booking not found" });
  res.json(booking);
});

export default router;
