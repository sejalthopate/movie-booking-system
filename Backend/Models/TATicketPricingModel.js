import mongoose from "mongoose";

const ticketPricingSchema = new mongoose.Schema(
  {
    movieName: {
      type: String,
      required: true,
    },

    screen: {
      type: String,
      required: true,
    },

    seatType: {
      type: String,
      enum: ["Classic", "Prime"],
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("TicketPricing", ticketPricingSchema);
