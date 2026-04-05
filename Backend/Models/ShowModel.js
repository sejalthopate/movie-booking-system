import mongoose from "mongoose";

const showSchema = new mongoose.Schema(
  {
    movieName: { type: String, required: true }, // Changed from showName
    theatreName: { type: String, required: true }, // Added this
    screenNumber: { type: Number, required: true },
    showDate: { type: String, required: true },
    showTime: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Show", showSchema);