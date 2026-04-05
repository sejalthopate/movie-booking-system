import mongoose from "mongoose";

const seatSchema = new mongoose.Schema(
  {
    theatreName: {
      type: String,
      required: true,
    },
    screenNumber: {
      type: Number,
      required: true,
    },
    row: {
      type: String, // A, B, C
      required: true,
    },
    seatNumber: {
      type: String, // A1, A2
      required: true,
    },
    category: {
      type: String, // CLASSIC / PRIME
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "booked"],
      default: "available",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Seat ||
  mongoose.model("Seat", seatSchema);
