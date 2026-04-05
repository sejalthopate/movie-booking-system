import React from "react";

export default function TheatreAdminDashboardHome({ onOpen }) {
  const files = [
    { label: "Movies", tab: "theatre-admin-movies", icon: "🎬" },
    { label: "Cast & Crew", tab: "theatre-admin-cast-crew", icon: "🎭" },
    { label: "Screens", tab: "theatre-admin-theaters", icon: "📺" },
    { label: "Bookings", tab: "theatre-admin-bookings", icon: "🎟️" },
    { label: "Ticket Pricing", tab: "theatre-admin-pricing", icon: "💰" },
    { label: "Offers & Coupons", tab: "theatre-admin-offers", icon: "🎁" },
    { label: "Reports & Analytics", tab: "theatre-admin-reports", icon: "📊" },
  ];

  return (
    <div className="space-y-8">

      {/* ================= WELCOME CARD ================= */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 
                      text-white p-8 rounded-3xl shadow-xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          Welcome Back, Admin 👋
        </h2>
        <p className="text-white/90 text-lg">
          Manage your theatre operations efficiently & smoothly.
        </p>
      </div>

      {/* ================= FEATURE CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {files.map((file, index) => (
          <div
            key={index}
            onClick={() => onOpen(file.tab)}
            className="group cursor-pointer 
                       bg-white/80 backdrop-blur-lg
                       border border-gray-200
                       rounded-3xl p-6 shadow-md
                       transition-all duration-300
                       hover:shadow-2xl
                       hover:-translate-y-2
                       hover:border-red-400"
          >
            {/* Icon */}
            <div className="w-14 h-14 flex items-center justify-center
                            bg-gradient-to-r from-red-500 to-pink-500
                            text-white rounded-2xl text-2xl mb-4
                            transition-all duration-300
                            group-hover:scale-110">
              {file.icon}
            </div>

            {/* Text */}
            <h3 className="text-lg font-semibold text-gray-800">
              {file.label}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Click to manage
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
