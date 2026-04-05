import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  theatreId: { type: String, required: true },
  movieId: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  seats: [{ type: String, required: true }], // e.g., ["A1","A2"]
}, { timestamps: true });

export default mongoose.model("TABooking", bookingSchema);
