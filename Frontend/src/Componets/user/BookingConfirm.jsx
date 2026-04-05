import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking } from "../../Services/BookingService";
import { useAppLanguage } from "../../i18n/useAppLanguage";

const confirmText = {
  English: {
    noData: "No booking data found",
    pleaseLogin: "Please login first",
    success: "Booking Successful!",
    failed: "Booking failed. Try again.",
    back: "Back",
    title: "Confirm Booking",
    date: "Date",
    time: "Time",
    seats: "Seats",
    pricePerSeat: "Price per Seat",
    snacks: "Snacks",
    total: "Total",
    confirmBooking: "Confirm Booking",
    cancelBooking: "Cancel Booking",
  },
  Hindi: {
    noData: "कोई बुकिंग डेटा नहीं मिला",
    pleaseLogin: "कृपया पहले लॉगिन करें",
    success: "बुकिंग सफल रही!",
    failed: "बुकिंग असफल रही। फिर से प्रयास करें।",
    back: "वापस",
    title: "बुकिंग की पुष्टि करें",
    date: "तारीख",
    time: "समय",
    seats: "सीटें",
    pricePerSeat: "प्रति सीट मूल्य",
    snacks: "स्नैक्स",
    total: "कुल",
    confirmBooking: "बुकिंग की पुष्टि करें",
    cancelBooking: "बुकिंग रद्द करें",
  },
  Marathi: {
    noData: "बुकिंग डेटा मिळाला नाही",
    pleaseLogin: "कृपया आधी लॉगिन करा",
    success: "बुकिंग यशस्वी झाली!",
    failed: "बुकिंग अयशस्वी झाली. पुन्हा प्रयत्न करा.",
    back: "मागे",
    title: "बुकिंगची पुष्टी करा",
    date: "तारीख",
    time: "वेळ",
    seats: "सीट्स",
    pricePerSeat: "प्रति सीट किंमत",
    snacks: "स्नॅक्स",
    total: "एकूण",
    confirmBooking: "बुकिंगची पुष्टी करा",
    cancelBooking: "बुकिंग रद्द करा",
  },
};

export default function BookingConfirm() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { appLanguage } = useAppLanguage();
  const text = confirmText[appLanguage] || confirmText.English;
  const user = JSON.parse(localStorage.getItem("user"));

  if (!state) return <h2 className="text-center mt-10">{text.noData}</h2>;

  const { movieId, theatreId, date, time, seats, snacks = [] } = state;
  const seatPrice = 150;
  const snacksTotal = snacks.reduce((acc, snack) => acc + snack.price * snack.qty, 0);
  const total = seats.length * seatPrice + snacksTotal;

  const handleConfirm = async () => {
    try {
      if (!user) {
        alert(text.pleaseLogin);
        navigate("/login");
        return;
      }

      await createBooking({
        userId: user._id,
        movieId,
        theatreId,
        date,
        time,
        seats,
        totalAmount: total,
        paymentStatus: "Success",
      });
// ✅ ADD THIS (DON'T REMOVE ANYTHING)
const bookingData = {
  movieName: state.movieName,
  theatreName: state.theatreName,
  user: user.name,
  seats,
  time,
  date,
  total,
};
console.log("FULL STATE:", state);
// ✅ SAVE TO LOCALSTORAGE
localStorage.setItem("bookingData", JSON.stringify(bookingData));

      alert(text.success);
      navigate("/booking/payment", { state: bookingData });
    } catch (err) {
      console.error("Booking Error:", err);
      alert(text.failed);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="absolute top-6 left-6">
        <button onClick={() => navigate(-1)} className="text-gray-700 font-medium hover:text-red-600">
          {text.back}
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-red-600">{text.title}</h2>

        <div className="space-y-2 text-gray-700">
          <p><b>{text.date}:</b> {date}</p>
          <p><b>{text.time}:</b> {time}</p>
          <p><b>{text.seats}:</b> {seats.join(", ")}</p>
          <p><b>{text.pricePerSeat}:</b> Rs.{seatPrice}</p>
          <p><b>{text.snacks}:</b> Rs.{snacksTotal}</p>
          <p className="text-lg font-bold text-red-600">
            {text.total}: Rs.{total}
          </p>
        </div>

        <button onClick={handleConfirm} className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold">
          {text.confirmBooking}
        </button>

        <button onClick={() => navigate("/user")} className="w-full mt-3 bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-lg font-bold">
          {text.cancelBooking}
        </button>
      </div>
    </div>
  );
}
BookingConfirm.jsx