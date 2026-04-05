import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminMovies from "../admin/AdminMovies";
import AdminTheaters from "../admin/AdminTheaters";
import AdminShows from "../admin/AdminShows";

import AdminSnacks from "../admin/AdminSnacks";
import AdminBooking from "../admin/AdminBooking";
import AdminReports from "../admin/AdminReports";
import AdminUsers from "../admin/AdminUsers";
// import AdminPersonForm from "./AddPerson";
import AddTheatreAdmin from "./AddTheatreAdmin";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("movies");
  const navigate = useNavigate();

  const tabs = [
    { id: "movies", label: "Movies" },
    { id: "theaters", label: "Theaters & Screens" },
    { id: "addTheatreAdmin", label: "Add Theatre Admin" },
    { id: "shows", label: "Shows" },
    // { id: "addperson", label: "Add cast and crew" },
    { id: "users", label: "Users" },
    { id: "snacks", label: "Snacks" },
    { id: "bookings", label: "Bookings" },
    { id: "reports", label: "Reports" },
    { id: "logout", label: "Logout" },
  ];

  // 🔥 LOGOUT FUNCTION
  const handleLogout = () => {
    console.log("Admin logged out");
    // clear auth data
    localStorage.clear(); // or removeItem("token")
    // redirect to login page
    navigate("/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "movies":
        return <AdminMovies />;
      case "theaters":
        return <AdminTheaters />;
      case "addTheatreAdmin":
        return <AddTheatreAdmin />;
      case "shows":
        return <AdminShows />;
      // case "addperson":
      //   return <AdminPersonForm />;
      case "users":
        return <AdminUsers />;
      case "snacks":
        return <AdminSnacks />;
      case "bookings":
        return <AdminBooking />;
      case "reports":
        return <AdminReports />;
      default:
        return <AdminMovies />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-pink-600 text-white text-xl md:text-2xl font-bold p-4 md:p-5 sticky top-0 z-50 text-center shadow-lg tracking-wide">
        🎬 Admin Dashboard
      </header>

      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* Sidebar / Navigation */}
        <aside className="bg-white shadow-xl md:w-72 flex md:flex-col overflow-x-auto md:overflow-y-auto scrollbar-hide border-b md:border-b-0 md:border-r border-gray-200 sticky top-[60px] md:top-auto z-40">
          <div className="flex md:flex-col p-3 md:p-6 gap-2 md:gap-3 min-w-max md:min-w-0 w-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  tab.id === "logout" ? handleLogout() : setActiveTab(tab.id)
                }
                className={`px-4 py-2.5 md:py-3 rounded-xl text-sm md:text-base font-semibold transition-all duration-300 whitespace-nowrap md:whitespace-normal text-center md:text-left
                ${
                  tab.id === "logout"
                    ? "bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-200 md:mt-4"
                    : activeTab === tab.id
                    ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md transform scale-105 md:scale-100"
                    : "hover:bg-red-50 text-gray-700 hover:text-red-500"
                }`}
              >
                {tab.id === "logout" ? `🚪 ${tab.label}` : tab.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-3 md:p-8 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 overflow-y-auto">
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg p-4 md:p-8 min-h-[80vh] w-full mx-auto max-w-7xl">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Mobile Footer Note (Optional) */}
      <div className="md:hidden bg-white text-[10px] text-center py-1 text-gray-400 border-t">
        Scroll menu horizontally to see all options
      </div>
    </div>
  );
}