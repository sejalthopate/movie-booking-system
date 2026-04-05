import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
  theaterId: { type: mongoose.Schema.Types.ObjectId, ref: "Theater", required: true },
  showId: { type: mongoose.Schema.Types.ObjectId, ref: "Show", required: true },
  seats: [{ type: String, required: true }],
  totalPrice: { type: Number, required: true },
  bookingDate: { type: Date, default: Date.now },
  paymentStatus: { type: String, default: "Pending" },
});

export default mongoose.model("Booking", BookingSchema);
