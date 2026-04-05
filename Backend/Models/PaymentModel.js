const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  payment_id: { type: String },            // Razorpay payment_id after success
  razorpay_order_id: { type: String, required: true }, // Razorpay order id
  amount: { type: Number, required: true },  // in paise
  currency: { type: String, default: "INR" },
  status: { type: String, default: "created" }, // created, paid, failed
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
