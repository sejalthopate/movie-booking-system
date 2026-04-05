import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Ticket, Calendar, Clock, MapPin, XCircle, ChevronLeft, AlertCircle } from "lucide-react";
import { useAppLanguage } from "../../i18n/useAppLanguage";

const bookingsText = {
  English: {
    confirmCancel: "Are you sure you want to cancel this booking? This action cannot be undone.",
    cancelSuccess: "Booking cancelled successfully.",
    cancelFailed: "Failed to cancel booking. Please try again.",
    loading: "Loading your tickets...",
    title: "My Bookings",
    totalBookings: "Total Bookings",
    empty: "You haven't booked any movies yet.",
    bookMovie: "Book a Movie",
    seats: "SEATS",
    amountPaid: "Amount Paid",
    cancelBooking: "Cancel Booking",
    refundSoon: "Refund will be processed shortly",
    defaultTheatre: "Main Cinema",
  },
  Hindi: {
    confirmCancel: "क्या आप इस बुकिंग को रद्द करना चाहते हैं? यह कार्रवाई वापस नहीं होगी।",
    cancelSuccess: "बुकिंग सफलतापूर्वक रद्द कर दी गई।",
    cancelFailed: "बुकिंग रद्द नहीं हो सकी। कृपया फिर से प्रयास करें।",
    loading: "आपकी टिकटें लोड हो रही हैं...",
    title: "मेरी बुकिंग",
    totalBookings: "कुल बुकिंग",
    empty: "आपने अभी तक कोई फिल्म बुक नहीं की है।",
    bookMovie: "फिल्म बुक करें",
    seats: "सीटें",
    amountPaid: "भुगतान की गई राशि",
    cancelBooking: "बुकिंग रद्द करें",
    refundSoon: "रिफंड जल्द ही प्रोसेस किया जाएगा",
    defaultTheatre: "मुख्य सिनेमा",
  },
  Marathi: {
    confirmCancel: "तुम्हाला ही बुकिंग रद्द करायची आहे का? ही कृती परत घेता येणार नाही.",
    cancelSuccess: "बुकिंग यशस्वीपणे रद्द झाली.",
    cancelFailed: "बुकिंग रद्द करता आली नाही. कृपया पुन्हा प्रयत्न करा.",
    loading: "तुमची तिकिटे लोड होत आहेत...",
    title: "माझ्या बुकिंग",
    totalBookings: "एकूण बुकिंग",
    empty: "तुम्ही अजून कोणताही चित्रपट बुक केलेला नाही.",
    bookMovie: "चित्रपट बुक करा",
    seats: "सीट्स",
    amountPaid: "भरलेली रक्कम",
    cancelBooking: "बुकिंग रद्द करा",
    refundSoon: "रिफंड लवकरच प्रक्रिया केला जाईल",
    defaultTheatre: "मुख्य सिनेमा",
  },
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { appLanguage } = useAppLanguage();
  const text = bookingsText[appLanguage] || bookingsText.English;
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchMyBookings = useCallback(async () => {
    if (!user) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/bookings/user-bookings/${user._id}`);
      setBookings(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) navigate("/login");
    else fetchMyBookings();
  }, [fetchMyBookings, navigate, user]);

  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm(text.confirmCancel);

    if (confirmCancel) {
      try {
        await axios.put(`http://localhost:5000/api/bookings/cancel/${bookingId}`, {
          role: "User",
        });
        alert(text.cancelSuccess);
        fetchMyBookings();
      } catch (err) {
        alert(text.cancelFailed);
        console.error(err);
      }
    }
  };

  if (loading) return <div className="text-center mt-20 font-bold">{text.loading}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button onClick={() => navigate("/user")} className="mr-4 p-2 hover:bg-white rounded-full transition shadow-sm">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Ticket className="text-red-600" /> {text.title}
          </h2>
        </div>
        <div className="text-sm font-medium text-gray-500">
          {text.totalBookings}: {bookings.length}
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow">
            <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">{text.empty}</p>
            <button onClick={() => navigate("/user")} className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg font-bold">
              {text.bookMovie}
            </button>
          </div>
        ) : (
          bookings.map((ticket) => (
            <div
              key={ticket._id}
              className={`bg-white rounded-2xl shadow-md overflow-hidden border-l-8 flex flex-col md:flex-row transition-all ${
                ticket.bookingStatus === "Cancelled" ? "border-red-500 grayscale-[0.5] opacity-80" : "border-green-500"
              }`}
            >
              <div className="w-full md:w-48 h-48 md:h-auto bg-gray-200">
                <img src={ticket.movieId?.poster} alt="movie poster" className="h-full w-full object-cover" />
              </div>

              <div className="p-6 flex-1 relative flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-800">{ticket.movieId?.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      ticket.bookingStatus === "Cancelled" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                    }`}>
                      {ticket.bookingStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 mt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} className="text-red-500" /> {ticket.date}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={16} className="text-red-500" /> {ticket.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 col-span-2">
                      <MapPin size={16} className="text-red-500" /> {ticket.theatreId?.theaterName || text.defaultTheatre}
                    </div>
                    <div className="col-span-2 text-sm font-bold bg-gray-50 p-2 rounded border border-dashed border-gray-300">
                      {text.seats}: <span className="text-red-600 tracking-widest">{ticket.seats?.join(", ")}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{text.amountPaid}</p>
                    <p className="text-xl font-black text-gray-800">Rs.{ticket.totalAmount}</p>
                  </div>

                  {ticket.bookingStatus === "Booked" && (
                    <button onClick={() => handleCancel(ticket._id)} className="flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-red-600 transition-colors">
                      <XCircle size={18} /> {text.cancelBooking}
                    </button>
                  )}

                  {ticket.bookingStatus === "Cancelled" && (
                    <p className="text-xs italic text-red-500 font-medium">{text.refundSoon}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
