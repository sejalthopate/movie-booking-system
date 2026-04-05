import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppLanguage } from "../../i18n/useAppLanguage";

const classicRows = ["A", "B"];
const primeRows = ["C", "D", "E", "F", "G"];
const seatsPerRow = 17;

const seatSelectionText = {
  English: {
    selectSeat: "Select at least one seat",
    loading: "Loading seats...",
    screen: "SCREEN",
    classic: "CLASSIC",
    prime: "PRIME",
    available: "Available",
    selected: "Selected",
    booked: "Booked",
    bookingSummary: "Booking Summary",
    selectedSeats: "Selected Seats",
    total: "Total",
    proceed: "Proceed",
    noTimeSlot: "No time slot available",
  },
  Hindi: {
    selectSeat: "कम से कम एक सीट चुनें",
    loading: "सीटें लोड हो रही हैं...",
    screen: "स्क्रीन",
    classic: "क्लासिक",
    prime: "प्राइम",
    available: "उपलब्ध",
    selected: "चयनित",
    booked: "बुक्ड",
    bookingSummary: "बुकिंग सारांश",
    selectedSeats: "चयनित सीटें",
    total: "कुल",
    proceed: "आगे बढ़ें",
    noTimeSlot: "कोई टाइम स्लॉट उपलब्ध नहीं",
  },
  Marathi: {
    selectSeat: "किमान एक सीट निवडा",
    loading: "सीट्स लोड होत आहेत...",
    screen: "स्क्रीन",
    classic: "क्लासिक",
    prime: "प्राइम",
    available: "उपलब्ध",
    selected: "निवडलेले",
    booked: "बुक झालेले",
    bookingSummary: "बुकिंग सारांश",
    selectedSeats: "निवडलेल्या सीट्स",
    total: "एकूण",
    proceed: "पुढे जा",
    noTimeSlot: "टाइम स्लॉट उपलब्ध नाही",
  },
};

export default function SeatSelection() {
  const { movieId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { appLanguage } = useAppLanguage();
  const text = seatSelectionText[appLanguage] || seatSelectionText.English;

  const theatreId = searchParams.get("theatre");
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classicPrice, setClassicPrice] = useState(null);
  const [primePrice, setPrimePrice] = useState(null);
  const layoutRef = useRef(null);
  const [layoutHeight, setLayoutHeight] = useState(0);

  useEffect(() => {
    if (!movieId || !theatreId || !date || !time) return;

    const fetchSeats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/seats", {
          params: { movieId, theatreId, date, time },
        });

        setSeats(res.data);
      } catch (err) {
        console.error("Seat fetch failed:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [movieId, theatreId, date, time]);

  useEffect(() => {
    if (!movieId || !theatreId || !date || !time) return;

    const fetchTicketPrices = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tickets", {
          params: { movieName: movieId, screen: theatreId, date, time },
        });

        const classic = res.data.find((ticket) => ticket.seatType === "Classic");
        const prime = res.data.find((ticket) => ticket.seatType === "Prime");

        setClassicPrice(classic?.price ?? 0);
        setPrimePrice(prime?.price ?? 0);
      } catch (err) {
        console.error("Ticket price fetch failed:", err);
        setClassicPrice(0);
        setPrimePrice(0);
      }
    };

    fetchTicketPrices();
  }, [movieId, theatreId, date, time]);

  useEffect(() => {
    if (layoutRef.current) setLayoutHeight(layoutRef.current.clientHeight);
  }, [selectedSeats]);

  const isSeatBooked = (seatId) => seats.find((seat) => seat.number === seatId)?.isBooked;

  const toggleSeat = (seatId) => {
    if (isSeatBooked(seatId)) return;

    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((seat) => seat !== seatId) : [...prev, seatId]
    );
  };

  const renderRow = (row) => (
    <div key={row} className="flex items-center mb-2">
      <span className="w-6 font-semibold">{row}</span>
      <div className="flex gap-1">
        {[...Array(seatsPerRow)].map((_, i) => {
          const seatId = `${row}${i + 1}`;
          const selected = selectedSeats.includes(seatId);
          const booked = isSeatBooked(seatId);

          return (
            <button
              key={seatId}
              disabled={booked}
              onClick={() => toggleSeat(seatId)}
              className={`w-7 h-7 text-xs border rounded transition ${
                booked
                  ? "bg-gray-600 text-white cursor-not-allowed"
                  : selected
                  ? "bg-yellow-400 border-yellow-400 text-black"
                  : "border-gray-400 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      alert(text.selectSeat);
      return;
    }

    navigate("/booking/snacks", {
      state: {
        movieId,
        theatreId,
        date,
        time,
        seats: selectedSeats,
      },
    });
  };

  if (loading) return <p className="text-center mt-10">{text.loading}</p>;

  const classicCount = selectedSeats.filter((seat) => classicRows.includes(seat.charAt(0))).length;
  const primeCount = selectedSeats.filter((seat) => primeRows.includes(seat.charAt(0))).length;
  const totalAmount = classicCount * classicPrice + primeCount * primePrice;

  return (
    <div className="min-h-screen bg-gray-200 p-6 flex justify-center gap-6">
      <div ref={layoutRef} className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-center text-gray-500 border-b-4 border-gray-300 pb-2 mb-6">
          {text.screen}
        </h2>

        <h4 className="font-semibold mb-2">{text.classic}</h4>
        {classicRows.map(renderRow)}

        <h4 className="font-semibold mt-6 mb-2">{text.prime}</h4>
        {primeRows.map(renderRow)}

        <div className="flex gap-6 mt-8 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 border border-gray-400 rounded"></span>
            {text.available}
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-yellow-400 rounded"></span>
            {text.selected}
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-gray-600 rounded"></span>
            {text.booked}
          </div>
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <div className="bg-white p-6 rounded-md shadow-lg w-80" style={{ height: layoutHeight }}>
          <h3 className="text-lg font-bold mb-4">{text.bookingSummary}</h3>

          <p className="font-semibold mb-1">{text.selectedSeats}:</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedSeats.map((seat) => (
              <span key={seat} className="bg-yellow-400 px-2 py-1 rounded text-sm">
                {seat}
              </span>
            ))}
          </div>

          <p className="mb-1">{text.classic}: {classicCount} x Rs.{classicPrice}</p>
          <p className="mb-3">{text.prime}: {primeCount} x Rs.{primePrice}</p>
          <p className="text-lg font-bold mb-6">{text.total}: Rs.{totalAmount}</p>

          <button
            onClick={handleProceed}
            className="bg-red-600 hover:bg-red-700 text-white w-full py-3 rounded-xl font-bold text-lg shadow"
          >
            {text.proceed}
          </button>
        </div>
      )}
    </div>
  );
}