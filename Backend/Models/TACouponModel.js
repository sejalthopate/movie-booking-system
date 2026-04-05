import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  theatreId: { type: String, required: true },
  movieId: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ["PERCENTAGE", "FLAT"], required: true },
  discountValue: { type: Number, required: true },
  validFrom: { type: Date },
  validTill: { type: Date },
  usageLimit: { type: Number, default: 0 },
  usedCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Coupon", couponSchema);
