import mongoose from "mongoose";
const BookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    theatreId: { type: mongoose.Schema.Types.ObjectId, ref: "Theatre", required: true },
  

    date: { type: String, required: true },
    time: { type: String, required: true },

   seats: [String],

cancelledBy: {
      type: String,
      enum: ["User", "Admin", null],
      default: null
    },
    totalAmount: { type: Number, required: true },
bookingStatus: {
  type: String,
  enum: ["Booked", "Cancelled"],
  default: "Booked"
},
    paymentStatus: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      default: "Pending",
    }
  },
  { timestamps: true }
);
const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;   // 👈 HE CHANGE KAR
