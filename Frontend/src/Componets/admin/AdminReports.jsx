import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function AdminReports() {
  const [summary, setSummary] = useState({});
  const [movieReport, setMovieReport] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [dateReport, setDateReport] = useState(null);

  const [theatreReport, setTheatreReport] = useState([]);
  const [timeSlotReport, setTimeSlotReport] = useState({});
  const [movieGraph, setMovieGraph] = useState([]);
  const [dateGraph, setDateGraph] = useState([]);
  const [popularMovieGraph, setPopularMovieGraph] = useState([]);

  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filter, setFilter] = useState({ date: "", movieId: "", theatreId: "" });
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);

  const [userActivity, setUserActivity] = useState({
    newUsersToday: 0,
    activeUsers: 0,
    cancelledBookings: 0
  });

  useEffect(() => {
    fetchSummary();
    fetchMovieReport();
    fetchTheatreReport();
    fetchTimeSlotReport();
    fetchGraphs();
    fetchUserActivity();
    fetchMovies();
    fetchTheatres();
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reports/user-activity/filter");
      setFilteredBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reports/summary");
      setSummary(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDateReport = async () => {
    if (!selectedDate) return;
    const res = await axios.get(`http://localhost:5000/api/reports/date-wise?date=${selectedDate}`);
    setDateReport(res.data);
  };

  const fetchGraphs = async () => {
    try {
      const movieRes = await axios.get("http://localhost:5000/api/reports/graph/movie-wise");
      setMovieGraph(movieRes.data);
      const dateRes = await axios.get("http://localhost:5000/api/reports/graph/date-wise");
      setDateGraph(dateRes.data);
      const popularRes = await axios.get("http://localhost:5000/api/reports/graph/popular-movie");
      setPopularMovieGraph(popularRes.data);
    } catch (err) {
      console.error("Graph fetch failed:", err);
    }
  };

  const applyFilter = async () => {
    try {
      const query = new URLSearchParams(filter).toString();
      const res = await axios.get(`http://localhost:5000/api/reports/user-activity/filter?${query}`);
      setFilteredBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTheatres = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/theatres/get-theatre");
      setTheatres(res.data);
    } catch (err) {
      console.error("Failed to fetch theatres:", err);
    }
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredBookings.map(b => ({
      User: b.userId?.name,
      Movie: b.movieId?.title,
      Theatre: b.theatreId?.location,
      Seats: b.seats.join(", "),
      Amount: b.totalAmount,
      Status: b.paymentStatus
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bookings");
    XLSX.writeFile(wb, "FilteredBookings.xlsx");
  };

  const fetchMovies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/movies/get-movie");
      setMovies(res.data);
    } catch (err) {
      console.error("Failed to fetch movies:", err);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Filtered Bookings", 14, 16);
    const tableColumn = ["User", "Movie", "Theatre", "Seats", "Amount", "Status"];
    const tableRows = filteredBookings.map(b => [
      b.userId?.name,
      b.movieId?.title,
      b.theatreId?.location,
      b.seats.join(", "),
      b.totalAmount,
      b.paymentStatus
    ]);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("FilteredBookings.pdf");
  };

  const fetchUserActivity = async () => {
    try {
      const newUsers = await axios.get("http://localhost:5000/api/reports/user-activity/new-users");
      const activeUsers = await axios.get("http://localhost:5000/api/reports/user-activity/active-users");
      const cancelled = await axios.get("http://localhost:5000/api/reports/user-activity/cancelled-bookings");
      setUserActivity({
        newUsersToday: newUsers.data.count || 0,
        activeUsers: activeUsers.data.count || 0,
        cancelledBookings: cancelled.data.count || 0
      });
    } catch (err) {
      console.error("Failed to fetch user activity:", err);
    }
  };

  const fetchMovieReport = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reports/movie-wise");
      setMovieReport(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTimeSlotReport = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reports/time-slot");
      setTimeSlotReport(res.data);
    } catch (err) {
      console.error("Time slot report fetch failed:", err);
    }
  };

  const fetchTheatreReport = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reports/theatre-wise");
      setTheatreReport(res.data);
    } catch (err) {
      console.error("Theatre wise report fetch failed:", err);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* ===== WELCOME CARD ===== */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 md:p-10 rounded-3xl shadow-xl">
        <h2 className="text-2xl md:text-4xl font-bold mb-2">Reports & Analytics 📊</h2>
        <p className="text-white/90 text-sm md:text-lg">View insights, revenue & performance analytics.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
        {[
          { label: "Total Movies", val: summary.totalMovies },
          { label: "Total Theatres", val: summary.totalTheatres },
          { label: "Total Users", val: summary.totalUsers },
          { label: "Total Bookings", val: summary.totalBookings },
          { label: "Total Revenue", val: `₹${summary.totalRevenue}`, color: "text-green-600" }
        ].map((item, i) => (
          <div key={i} className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-3xl p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
            <h4 className="text-sm font-medium text-gray-500">{item.label}</h4>
            <p className={`text-2xl font-bold ${item.color || "text-gray-800"}`}>{item.val}</p>
          </div>
        ))}
      </div>

      {/* Date Wise Picker */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
        <h3 className="font-bold mb-4">Date Wise Report</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border p-2 rounded-xl flex-grow"
          />
          <button onClick={fetchDateReport} className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition">
            Get Report
          </button>
        </div>
        {dateReport && (
          <div className="mt-4 grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl">
            <div><p className="text-sm text-gray-500">Bookings</p><p className="font-bold">{dateReport.totalBookings}</p></div>
            <div><p className="text-sm text-gray-500">Revenue</p><p className="font-bold text-green-600">₹{dateReport.totalRevenue}</p></div>
          </div>
        )}
      </div>

      {/* Analytics Charts */}
      <h3 className="text-xl font-bold mt-8">Analytics Charts</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-3xl p-4 md:p-6 shadow-sm">
          <h4 className="font-semibold mb-4">Movie-wise Revenue</h4>
          <Bar data={{
            labels: movieGraph.map(d => d.movie),
            datasets: [{ label: "Revenue (₹)", data: movieGraph.map(d => d.revenue), backgroundColor: "rgba(255, 99, 132, 0.6)" }]
          }} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-4 md:p-6 shadow-sm">
          <h4 className="font-semibold mb-4">Date-wise Booking Growth</h4>
          <Line data={{
            labels: dateGraph.map(d => d.date),
            datasets: [{ label: "Bookings", data: dateGraph.map(d => d.bookings), borderColor: "rgba(54, 162, 235, 0.8)", tension: 0.3 }]
          }} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-4 md:p-6 shadow-sm lg:col-span-2 flex flex-col items-center">
          <h4 className="font-semibold mb-4 w-full">Most Popular Movie</h4>
          <div className="w-full max-w-md">
            <Pie data={{
              labels: popularMovieGraph.map(d => d.movie),
              datasets: [{ data: popularMovieGraph.map(d => d.seatsBooked), backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"] }]
            }} options={{ responsive: true }} />
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="space-y-8">
        {/* Movie Report Table */}
        <div>
          <h3 className="text-xl font-bold mb-4">Movie Wise Revenue Report</h3>
          <div className="overflow-x-auto rounded-2xl shadow-sm border border-gray-200">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Movie Name</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Bookings</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {movieReport.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition">
                    <td className="p-4 text-sm">{item.movie?.title}</td>
                    <td className="p-4 text-sm">{item.totalBookings}</td>
                    <td className="p-4 text-sm text-green-600 font-medium">₹{item.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Theatre Report Table */}
        <div>
          <h3 className="text-xl font-bold mb-4">Theatre Wise Booking Report</h3>
          <div className="overflow-x-auto rounded-2xl shadow-sm border border-gray-200">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Theatre Name</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Shows</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Bookings</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {theatreReport.map((item) => (
                  <tr key={item._id || item.theatreName} className="hover:bg-gray-50 transition">
                    <td className="p-4 text-sm">{item.theatreName}</td>
                    <td className="p-4 text-sm">{item.totalShows}</td>
                    <td className="p-4 text-sm">{item.totalBookings}</td>
                    <td className="p-4 text-sm text-green-600 font-medium">₹{item.totalRevenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Time Slots */}
      <h3 className="text-2xl font-bold mt-10">⏰ Time-slot Wise Report</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Morning", icon: "🌅", time: "6AM-12PM", val: timeSlotReport.morning, color: "text-orange-600", border: "hover:border-orange-400" },
          { label: "Afternoon", icon: "☀️", time: "12PM-4PM", val: timeSlotReport.afternoon, color: "text-yellow-600", border: "hover:border-yellow-400" },
          { label: "Evening", icon: "🌇", time: "4PM-8PM", val: timeSlotReport.evening, color: "text-pink-600", border: "hover:border-pink-400" },
          { label: "Night", icon: "🌙", time: "8PM-12AM", val: timeSlotReport.night, color: "text-indigo-600", border: "hover:border-indigo-400" }
        ].map((slot, i) => (
          <div key={i} className={`bg-white border border-gray-200 rounded-3xl p-4 text-center transition-all ${slot.border} hover:shadow-md`}>
            <div className="text-3xl mb-1">{slot.icon}</div>
            <h4 className="font-semibold text-sm">{slot.label}</h4>
            <p className="text-[10px] text-gray-400 mb-1">{slot.time}</p>
            <p className={`text-xl font-bold ${slot.color}`}>{slot.val || 0}</p>
          </div>
        ))}
      </div>

      {/* Filters & Activity */}
      <h3 className="text-xl font-bold mt-8">User Activity & Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
          <h4 className="text-sm text-gray-500">New Users Today</h4>
          <p className="text-2xl font-bold">{userActivity.newUsersToday}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
          <h4 className="text-sm text-gray-500">Active Users (7 Days)</h4>
          <p className="text-2xl font-bold">{userActivity.activeUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
          <h4 className="text-sm text-gray-500">Cancelled Bookings</h4>
          <p className="text-2xl font-bold text-red-500">{userActivity.cancelledBookings}</p>
        </div>
      </div>

      {/* Main Filter Section */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
        <h4 className="font-semibold mb-4">Filter Bookings</h4>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => { setFilter({ date: "", movieId: "", theatreId: "" }); fetchAllBookings(); }} className="bg-gray-100 px-4 py-2 rounded-xl text-sm font-medium">All</button>
          <input type="date" value={filter.date} onChange={e => setFilter({ ...filter, date: e.target.value })} className="border p-2 rounded-xl text-sm" />
          <select value={filter.movieId} onChange={e => setFilter({ ...filter, movieId: e.target.value })} className="border p-2 rounded-xl text-sm flex-grow sm:flex-grow-0">
            <option value="">Select Movie</option>
            {movies.map((m, idx) => <option key={m._id || idx} value={m._id}>{m.title}</option>)}
          </select>
          <select value={filter.theatreId} onChange={e => setFilter({ ...filter, theatreId: e.target.value })} className="border p-2 rounded-xl text-sm flex-grow sm:flex-grow-0">
            <option value="">Select Theatre</option>
            {theatres.map((t, idx) => <option key={t._id || idx} value={t._id}>{t.location}</option>)}
          </select>
          <button onClick={applyFilter} className="bg-red-600 text-white px-6 py-2 rounded-xl text-sm font-bold">Apply</button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          <button onClick={exportExcel} className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex-grow sm:flex-grow-0">Export Excel</button>
          <button onClick={exportPDF} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex-grow sm:flex-grow-0">Export PDF</button>
        </div>
      </div>

      {/* Filtered Table */}
      <div className="overflow-x-auto rounded-3xl border border-gray-200 shadow-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
            <tr>
              <th className="p-3 text-left text-xs uppercase font-bold">User</th>
              <th className="p-3 text-left text-xs uppercase font-bold">Movie</th>
              <th className="p-3 text-left text-xs uppercase font-bold">Theatre</th>
              <th className="p-3 text-left text-xs uppercase font-bold">Seats</th>
              <th className="p-3 text-left text-xs uppercase font-bold">Amount</th>
              <th className="p-3 text-left text-xs uppercase font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredBookings.map(b => (
              <tr key={b._id || `${b.userId?._id}-${b.movieId?._id}`} className="hover:bg-gray-50 transition">
                <td className="p-3 text-sm">{b.userId?.name}</td>
                <td className="p-3 text-sm">{b.movieId?.title}</td>
                <td className="p-3 text-sm">{b.theatreId?.location}</td>
                <td className="p-3 text-sm">{b.seats.join(", ")}</td>
                <td className="p-3 text-sm font-bold">₹{b.totalAmount}</td>
                <td className="p-3 text-xs">
                    <span className={`px-2 py-1 rounded-full ${b.paymentStatus === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {b.paymentStatus}
                    </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}