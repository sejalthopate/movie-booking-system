import React, { useEffect, useState } from "react";
import { fetchTAOverview } from "../../Services/TAReportApi";
import axios from "axios";

const TAReports = () => {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    movieId: "",
  });

  const [data, setData] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Movies FIXED
const fetchMovies = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/movies/get-movie");
    setMovies(Array.isArray(res.data) ? res.data : []);
  } catch (err) {
    console.error(err);
    setMovies([]);
  }
};

  // ✅ Fetch Overview FIXED
  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await fetchTAOverview(filters);
      setData(res.data || {});
      setLoading(false);
    } catch (err) {
      console.error(err);
      setData({});
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchOverview();
  }, []);

  const applyFilters = () => {
    fetchOverview();
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full p-6 flex flex-col items-center">
      <div className="w-full max-w-7xl">
        <h1 className="text-4xl font-extrabold mb-6 text-red-600 text-center">
          📊 TA Reports & Analytics
        </h1>

        {/* FILTERS */}
        <div className="bg-white p-6 rounded-xl shadow-lg grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <input
            type="date"
            className="border p-3 rounded-lg"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />

          <input
            type="date"
            className="border p-3 rounded-lg"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />

          <select
            className="border p-3 rounded-lg"
            value={filters.movieId}
            onChange={(e) => setFilters({ ...filters, movieId: e.target.value })}
          >
            <option value="">All Movies</option>
            {movies.map((m) => (
              <option key={m._id} value={m._id}>
                {m.title}
              </option>
            ))}
          </select>

          <button
            onClick={applyFilters}
            className="bg-red-600 text-white px-6 py-3 rounded-xl"
          >
            Apply Filters
          </button>
        </div>

        {/* CARDS */}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl text-center">
              <p>Total Bookings</p>
              <h2 className="text-3xl">{data?.totalBookings || 0}</h2>
            </div>

            <div className="bg-white p-6 rounded-2xl text-center">
              <p>Total Revenue</p>
              <h2 className="text-3xl">₹ {data?.totalRevenue || 0}</h2>
            </div>

            <div className="bg-white p-6 rounded-2xl text-center">
              <p>Total Shows</p>
              <h2 className="text-3xl">{data?.totalShows || 0}</h2>
            </div>

            <div className="bg-white p-6 rounded-2xl text-center">
              <p>Seat Occupancy</p>
              <h2 className="text-3xl">
                {data?.seatOccupancy ? data.seatOccupancy.toFixed(1) : 0} %
              </h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TAReports;