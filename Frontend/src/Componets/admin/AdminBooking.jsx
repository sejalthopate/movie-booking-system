import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminBookingDashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const res = await axios.get("http://localhost:5000/api/bookings/all");
    setBookings(res.data);
  };

  // --- REPORT LOGIC ---
  const totalBookings = bookings.length;
  // Count only those cancelled by the user
  const userCancelledCount = bookings.filter(b => b.bookingStatus === "Cancelled" && b.cancelledBy === "User").length;
  const activeBookings = bookings.filter(b => b.bookingStatus === "Booked").length;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* 📊 REPORT SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-blue-500">
          <h4 className="text-gray-500 text-sm font-bold uppercase">Total Tickets</h4>
          <p className="text-3xl font-bold">{totalBookings}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-green-500">
          <h4 className="text-gray-500 text-sm font-bold uppercase">Active Shows</h4>
          <p className="text-3xl font-bold">{activeBookings}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-red-500">
          <h4 className="text-gray-500 text-sm font-bold uppercase">User Cancellations</h4>
          <p className="text-3xl font-bold text-red-600">{userCancelledCount}</p>
        </div>
      </div>

      {/* 📑 BOOKING LIST SECTION */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-4">Customer</th>
              <th className="p-4">Movie</th>
              <th className="p-4">Status</th>
              <th className="p-4">Amount</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr 
                key={b._id} 
                className={`border-b transition ${
                  b.bookingStatus === "Cancelled" 
                  ? "bg-red-50 opacity-80" // <--- HIGHLIGHTED RED IF CANCELLED
                  : "hover:bg-gray-50"
                }`}
              >
                <td className="p-4">
                   <p className="font-bold">{b.userId?.name}</p>
                   <p className="text-xs text-gray-400">{b._id}</p>
                </td>
                <td className="p-4 font-medium">{b.movieId?.title}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    b.bookingStatus === "Booked" 
                    ? "bg-green-100 text-green-700" 
                    : "bg-red-200 text-red-800" // Highlighted Status Badge
                  }`}>
                    {b.bookingStatus} {b.cancelledBy === "User" && "(By User)"}
                  </span>
                </td>
                <td className="p-4 font-bold">₹{b.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}