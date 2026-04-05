import mongoose from "mongoose";

const theatreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Added theatre name
    location: { type: String, required: true },
    city: { type: String, required: true },
    screens: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Theatre || mongoose.model("Theatre", theatreSchema);