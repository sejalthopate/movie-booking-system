import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  Film,
  Users,
  Building2,
  Ticket,
  IndianRupee,
  Gift,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import TheatreAdminMovies from "./TheatreAdminMovies";
import TheatreAdminTheaters from "./TheatreAdminTheaters";
import TheatreAdminBookings from "./TheatreAdminBookings";
import TheatreAdminReports from "./ThreatreAdminReports";
import TheatreAdminDashboardHome from "./ThreaterAdminHomeDashboard";
import TheatreAdminPricing from "./ThreatreAdminPricing";
import TheatreAdminOffers from "./ThreatreAdminOffers";
import AdminPersonForm from "./AddPerson";

export default function TheatreAdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [profileImage, setProfileImage] = useState("");
  const [email, setEmail] = useState("");
  const [adminName, setAdminName] = useState("");
  const [mobile, setMobile] = useState("");

  const navigate = useNavigate();

  // Load user data
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const savedEmail = userData?.email;

    if (savedEmail) {
      setEmail(savedEmail);

      const savedProfile = JSON.parse(
        localStorage.getItem(`profile_${savedEmail}`)
      );

      if (savedProfile) {
        setAdminName(savedProfile.adminName || "");
        setMobile(savedProfile.mobile || "");
        setProfileImage(savedProfile.profileImage || "");
      }
    }
  }, []);

  // Image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Save profile
  const handleSaveProfile = () => {
    if (!email) return;

    const profileData = {
      adminName,
      mobile,
      profileImage,
    };

    localStorage.setItem(`profile_${email}`, JSON.stringify(profileData));
    alert("Profile Saved ✅");
  };

  // Update profile
  const handleUpdateProfile = () => {
    if (!email) return;

    const profileData = {
      adminName,
      mobile,
      profileImage,
    };

    localStorage.setItem(`profile_${email}`, JSON.stringify(profileData));
    alert("Profile Updated ✅");
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "theatre-admin-movies", label: "Manage Movies", icon: <Film size={18} /> },
   
     { id: "addperson", label: "Add cast and crew" , icon: <Building2 size={18} /> },
    { id: "theatre-admin-bookings", label: "Booking Management", icon: <Ticket size={18} /> },
    { id: "theatre-admin-pricing", label: "Ticket Pricing", icon: <IndianRupee size={18} /> },
    { id: "theatre-admin-offers", label: "Offers & Coupons", icon: <Gift size={18} /> },
    { id: "theatre-admin-reports", label: "Reports & Analytics", icon: <BarChart3 size={18} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <TheatreAdminDashboardHome onOpen={setActiveTab} />;
      case "theatre-admin-movies":
        return <TheatreAdminMovies />;
     case "addperson":
        return <AdminPersonForm />;
      case "theatre-admin-theaters":
        return <TheatreAdminTheaters />;
      case "theatre-admin-bookings":
        return <TheatreAdminBookings />;
      case "theatre-admin-pricing":
        return <TheatreAdminPricing />;
      case "theatre-admin-offers":
        return <TheatreAdminOffers />;
      case "theatre-admin-reports":
        return <TheatreAdminReports />;
      default:
        return <TheatreAdminDashboardHome onOpen={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">

      {/* HEADER */}
      <header className="bg-gradient-to-r from-red-600 to-pink-600 text-white flex items-center justify-between px-6 py-4 shadow-xl">

        <div className="flex items-center gap-3">
          <button
            className="md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
          <h1 className="text-xl md:text-2xl font-bold tracking-wide">
            🎬 Theatre Admin
          </h1>
        </div>

        {/* Profile Icon */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="bg-white/100 p-2 rounded-full hover:bg-gray-200 transition"
          >
            <img
              src={profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt="profile"
              className="w-9 h-9 rounded-full border-2 border-white object-cover"
            />
          </button>
        </div>
      </header>

      {/* BODY */}
      <div className="flex flex-1">
        <aside
          className={`w-72 bg-white shadow-2xl p-6 space-y-2 transition-all duration-300
          ${sidebarOpen ? "block absolute z-50 h-full" : "hidden"}
          md:block md:relative`}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition
                ${activeTab === tab.id
                  ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
                  : "hover:bg-red-100 text-gray-700"
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 mt-6 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
          >
            🚪 Logout
          </button>
        </aside>

        <main className="flex-1 p-6">
          <div className="bg-white rounded-3xl shadow-xl p-8 min-h-[500px]">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* PROFILE POPUP */}
      {profileOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setProfileOpen(false)}
          ></div>

          {/* Popup */}
          <div className="relative w-full md:w-96 bg-white p-8 shadow-xl">
            <button
              onClick={() => setProfileOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold text-lg"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-6">Profile</h2>

            <div className="text-center mb-6">
              <label className="cursor-pointer block">
                <img
                  src={profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  alt="profile"
                  className="w-28 h-28 rounded-full mx-auto border-4 border-pink-500 object-cover"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <input
              type="text"
              placeholder="Admin Name"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className="w-full mb-4 px-4 py-3 rounded-lg border focus:ring-2 focus:ring-pink-500 outline-none"
            />

            <input
              type="text"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full mb-4 px-4 py-3 rounded-lg border focus:ring-2 focus:ring-pink-500 outline-none"
            />

            <input
              type="email"
              value={email}
              disabled
              className="w-full mb-6 px-4 py-3 rounded-lg border bg-gray-100"
            />

            <div className="flex gap-4">
              <button
                onClick={handleSaveProfile}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition"
              >
                💾 Save
              </button>

              <button
                onClick={handleUpdateProfile}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition"
              >
                🔄 Update
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-gradient-to-r from-red-600 to-pink-600 text-white text-center py-4 shadow-inner">
        © {new Date().getFullYear()} Theatre Admin Panel | Designed by Srushti ✨
      </footer>
    </div>
  );
}
