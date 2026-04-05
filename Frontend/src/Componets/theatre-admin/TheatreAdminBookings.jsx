import React, { useEffect, useState, useCallback } from "react";
import { getBookedSeats } from "../../Services/BookingApi";

const classicRows = ["A", "B"];
const primeRows = ["C", "D", "E", "F", "G"];
const seatsPerRow = 17;
const timeSlots = ["10:00 AM", "1:30 PM", "6:00 PM", "9:30 PM"];

const SeatBooking = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedSeats, setBookedSeats] = useState([]);

  // MUST match booking data
  const theatreId = "t1";
  const movieId = "m1";

  const fetchBookedSeats = useCallback(async () => {
    try {
      const res = await getBookedSeats({
        theatreId,
        movieId,
        date: selectedDate,
        time: selectedTime,
      });

      console.log("Booked Seats Response:", res.data);

      // ✅ MAIN FIX
      setBookedSeats(res.data?.bookedSeats || []);
    } catch (err) {
      console.error("Error fetching booked seats", err);
      setBookedSeats([]);
    }
  }, [theatreId, movieId, selectedDate, selectedTime]);

  useEffect(() => {
    if (selectedDate && selectedTime) {
      fetchBookedSeats();
    }
  }, [selectedDate, selectedTime, fetchBookedSeats]);

  const renderRow = (row) => (
    <div key={row} className="flex items-center mb-2">
      <span className="w-6 font-semibold">{row}</span>

      <div className="flex gap-1 flex-wrap">
        {[...Array(seatsPerRow)].map((_, i) => {
          const seatId = `${row}${i + 1}`;
          const isBooked = bookedSeats.includes(seatId);

          return (
            <button
              key={seatId}
              disabled={isBooked}
              className={`w-7 h-7 text-xs border rounded
                ${
                  isBooked
                    ? "bg-gray-600 text-white cursor-not-allowed"
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

  return (
    <div className="bg-white p-6 rounded-md shadow-md max-w-4xl mx-auto mt-6">
      {/* DATE & TIME */}
      <div className="flex gap-4 mb-6">
        <input
          type="date"
          className="border px-3 py-2 rounded w-1/2"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded w-1/2"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
        >
          <option value="">Select Time Slot</option>
          {timeSlots.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <h2 className="text-center text-gray-500 border-b-4 border-gray-300 pb-2 mb-6">
        SCREEN
      </h2>

      <h4 className="font-semibold mb-2">CLASSIC </h4>
      {classicRows.map(renderRow)}

      <h4 className="font-semibold mt-6 mb-2">PRIME </h4>
      {primeRows.map(renderRow)}
    </div>
  );
};

export default SeatBooking;
