import React, { useEffect, useState } from "react";
import { getShows, getSeatsByShow, updateSeatsByShow } from "../../Services/TheatreAdminSeatApi";

export default function TheatreAdminSeats() {
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [seats, setSeats] = useState([]);

  useEffect(() => {
    getShows().then(setShows).catch(console.log);
  }, []);

  useEffect(() => {
    if (selectedShow) {
      getSeatsByShow(selectedShow._id).then(setSeats).catch(console.log);
    }
  }, [selectedShow]);

  const toggleSeat = (seatNumber) => {
    setSeats((prev) =>
      prev.map((s) => {
        if (s.number === seatNumber && s.status !== "Reserved") {
          return { ...s, status: s.status === "Available" ? "Blocked" : "Available" };
        }
        return s;
      })
    );
  };

  const saveSeats = () => {
    updateSeatsByShow(selectedShow._id, seats)
      .then(() => alert("Seats updated!"))
      .catch(console.log);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">💺 Seat Management</h2>

      <select
        className="border p-2 rounded mb-4"
        onChange={(e) => {
          const show = shows.find((s) => s._id === e.target.value);
          setSelectedShow(show);
        }}
      >
        <option value="">Select Show</option>
        {shows.map((show) => (
          <option key={show._id} value={show._id}>
            {show.movie.title} - {show.screen.name} - {new Date(show.startTime).toLocaleString()}
          </option>
        ))}
      </select>

      {selectedShow && (
        <>
          <div className="grid grid-cols-8 gap-2 mb-4">
            {seats.map((seat) => (
              <div
                key={seat.number}
                onClick={() => toggleSeat(seat.number)}
                className={`p-3 text-center rounded cursor-pointer ${
                  seat.status === "Available"
                    ? "bg-green-500 text-white"
                    : seat.status === "Reserved"
                    ? "bg-red-500 text-white cursor-not-allowed"
                    : "bg-gray-500 text-white"
                }`}
              >
                {seat.number}
              </div>
            ))}
          </div>

          <div className="flex gap-4 mb-4">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-500"></div> Available
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-red-500"></div> Reserved
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-gray-500"></div> Blocked
            </div>
          </div>

          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={saveSeats}>
            Save Changes
          </button>
        </>
      )}
    </div>
  );
}
