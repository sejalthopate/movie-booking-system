import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
  theatreId: { type: mongoose.Schema.Types.ObjectId, ref: "Theatre" },
  showTime: { type: String }, // "10:00 AM"
  seats: [{ type: String }],
  amount: { type: Number },
  bookingDate: { type: Date, default: Date.now },
  status: { type: String, default: "confirmed" },
});

const TAReport = mongoose.model("TAReport", bookingSchema);

export default TAReport;
