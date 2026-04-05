import React, { useState, useEffect } from "react";
import { fetchSeats } from "../../Services/SeatApi";

export default function AdminSeats() {
  const [theatres, setTheatres] = useState([]);
  const [filteredTheatres, setFilteredTheatres] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedTheatre, setSelectedTheatre] = useState("");
  const [screens, setScreens] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState("");
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH THEATRES ---------------- */
  useEffect(() => {
    fetch("http://localhost:5000/api/theatres/get-theatre")
      .then((res) => res.json())
      .then((data) => {
        setTheatres(data || []);
        setFilteredTheatres(data || []);
      })
      .catch(console.error);
  }, []);

  /* ---------------- SEARCH FILTER ---------------- */
  useEffect(() => {
    setFilteredTheatres(
      theatres.filter((t) =>
        t.name.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [searchText, theatres]);

  /* ---------------- SCREENS ---------------- */
  useEffect(() => {
    if (!selectedTheatre) return;

    const theatre = theatres.find((t) => t._id === selectedTheatre);

    if (theatre?.screens) {
      setScreens(
        Array.from({ length: theatre.screens }, (_, i) => `Screen ${i + 1}`)
      );
      setSelectedScreen("");
      setSeats([]);
    }
  }, [selectedTheatre, theatres]);

  /* ---------------- FETCH / GENERATE SEATS ---------------- */
  useEffect(() => {
    if (!selectedTheatre || !selectedScreen) return;

    setLoading(true);

    fetchSeats(selectedTheatre, selectedScreen)
      .then((data) => {
        let seatData = [];

        if (Array.isArray(data)) seatData = data;
        else if (data?.seats && Array.isArray(data.seats))
          seatData = data.seats;

        if (seatData.length === 0) {
          const rows = ["A", "B", "C", "D", "E"];
          const cols = 8;
          const generated = [];

          rows.forEach((row) => {
            for (let i = 1; i <= cols; i++) {
              generated.push({
                seatId: `${row}${i}`,
                booked: false,
                blocked: false,
              });
            }
          });

          setSeats(generated);
        } else {
          setSeats(seatData);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedTheatre, selectedScreen]);

  /* ---------------- SEAT COLOR ---------------- */
  const seatColor = (seat) => {
    if (seat.blocked) return "bg-gray-700";
    if (seat.booked) return "bg-red-500";
    return "bg-green-500";
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        🎬 Seat Layout (Admin – Theatre View)
      </h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search Theatre..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="border p-2 rounded mb-4 w-64"
      />

      {/* Theatre */}
      <div className="mb-4">
        <select
          value={selectedTheatre}
          onChange={(e) => setSelectedTheatre(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">-- Select Theatre --</option>
          {filteredTheatres.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Screen */}
      {screens.length > 0 && (
        <div className="mb-6">
          <select
            value={selectedScreen}
            onChange={(e) => setSelectedScreen(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">-- Select Screen --</option>
            {screens.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-6 mb-4 text-sm">
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 bg-green-500 rounded"></span> Available
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 bg-red-500 rounded"></span> Booked
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 bg-gray-700 rounded"></span> Blocked
        </span>
      </div>

      {/* Screen Label */}
      {seats.length > 0 && (
        <div className="text-center font-semibold mb-3">
          ───── SCREEN ─────
        </div>
      )}

      {loading && <p>Loading seats...</p>}

      {/* Seats */}
      {seats.length > 0 && (
        <div className="space-y-3">
          {["A", "B", "C", "D", "E"].map((row) => (
            <div key={row} className="flex justify-center gap-2">
              {seats
                .filter((s) => s.seatId?.startsWith(row))
                .map((seat) => (
                  <div
                    key={seat.seatId}
                    className={`w-10 h-10 rounded text-white text-xs flex items-center justify-center ${seatColor(
                      seat
                    )}`}
                  >
                    {seat.seatId}
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
