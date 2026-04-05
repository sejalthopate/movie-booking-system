import mongoose from "mongoose";

const snackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, default: "General" },
    image: { type: String },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Snack = mongoose.model("Snack", snackSchema);
export default Snack;