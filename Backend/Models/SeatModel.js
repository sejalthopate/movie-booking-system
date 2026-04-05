import mongoose from "mongoose";

const SeatSchema = new mongoose.Schema({
  theatreId: { type: mongoose.Schema.Types.ObjectId, ref: "Theatre", required: true },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
  number: { type: String, required: true },
  date: { type: String, required: true }, // 'YYYY-MM-DD'
  time: { type: String, required: true }, // e.g., '10:00 AM'
  isBooked: { type: Boolean, default: false },
 

});

export default mongoose.model("Seat", SeatSchema);
