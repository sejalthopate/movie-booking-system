import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMoviesApi } from "../../Services/MovieApi";
import { useAppLanguage } from "../../i18n/useAppLanguage";

import {
  Bell,
  ChevronDown,
  Heart,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Mic,
  Home,
  Film,
  LogOut,
  MapPin,
  Globe,
  Shield,
  Ticket,
  User,
  Clapperboard,
  X
} from "lucide-react";

const uiText = {
  English: {
    profile: "Profile",
    hello: (name) => `Hello, ${name}`,
    helpSupport: "Help & Support",
    favourite: "Favourite",
    bookingHistory: "Booking History",
    privacySecurity: "Privacy & Security",
    notification: "Notification",
    settings: "Settings",
    appLanguage: "Language (App Language)",
    appTheme: "App Theme (Dark / Light)",
    light: "Light",
    dark: "Dark",
    logout: "Logout",
    myBookings: "My Bookings",
    home: "Home",
    movies: "Movies",
    theatres: "Theatres",
    searchMovies: "Search movies...",
    failedMovies: "Failed to load movies",
    voiceSearchNotSupported: "Voice search not supported",
    featuredMovie: "Featured Movie",
    bookNow: "Book Now",
    theatresNearMe: (city) => `Theatres Near Me (${city})`,
    upcoming: (count) => `Upcoming (${count})`,
    favouritesCount: (count) => `Favourites (${count})`,
    notifications: "Notifications",
    dashboardUpdates: "Dashboard updates",
    activeShortcuts: (count) =>
      `You have ${count} active profile shortcuts ready to use.`,
    readyMessage:
      "Your profile menu is ready. Start exploring to fill it with activity.",
    bookingHistoryInfo:
      "Open your booking history directly from the new profile panel.",
    savedSettings: "Saved settings",
    themeSummary: (isDark, language) =>
      `Theme: ${isDark ? "Dark" : "Light"} | Language: ${language}`,
    recentlyViewed: "Recently Viewed",
    favouriteMovies: "Favourite Movies",
    saveMoviesHint:
      "Save movies with the heart icon and they will appear here.",
    filterForYou: "For You",
    moviesByGenre: (genre) => `${genre} Movies`,
    helpSupportText:
      "Use this area for booking support, refund guidance, or contact details when you connect the menu to your broader system.",
    openBookingHistory: "Open Booking History",
    loggedInAs: (email) => `Logged in as: ${email || "unknown user"}`,
    privacyText:
      "Theme and app language preferences are now stored locally so the profile menu keeps its state after refresh.",
    footerBrand: "EliteCine",
    footerText: "Book movies | discover theatres | easy payments",
  },
  Hindi: {
    profile: "प्रोफाइल",
    hello: (name) => `नमस्ते, ${name}`,
    helpSupport: "मदद और सहायता",
    favourite: "पसंदीदा",
    bookingHistory: "बुकिंग हिस्ट्री",
    privacySecurity: "गोपनीयता और सुरक्षा",
    notification: "सूचनाएं",
    settings: "सेटिंग्स",
    appLanguage: "भाषा (ऐप भाषा)",
    appTheme: "ऐप थीम (डार्क / लाइट)",
    light: "लाइट",
    dark: "डार्क",
    logout: "लॉगआउट",
    myBookings: "मेरी बुकिंग",
    home: "होम",
    movies: "फिल्में",
    theatres: "थियेटर",
    searchMovies: "फिल्में खोजें...",
    failedMovies: "फिल्में लोड नहीं हो सकीं",
    voiceSearchNotSupported: "वॉइस सर्च समर्थित नहीं है",
    featuredMovie: "फीचर्ड फिल्म",
    bookNow: "अभी बुक करें",
    theatresNearMe: (city) => `मेरे पास के थियेटर (${city})`,
    upcoming: (count) => `आने वाली फिल्में (${count})`,
    favouritesCount: (count) => `पसंदीदा (${count})`,
    notifications: "सूचनाएं",
    dashboardUpdates: "डैशबोर्ड अपडेट",
    activeShortcuts: (count) =>
      `आपके पास ${count} सक्रिय प्रोफाइल शॉर्टकट उपलब्ध हैं।`,
    readyMessage:
      "आपका प्रोफाइल मेनू तैयार है। गतिविधि देखने के लिए एक्सप्लोर करें।",
    bookingHistoryInfo:
      "नई प्रोफाइल पैनल से सीधे अपनी बुकिंग हिस्ट्री खोलें।",
    savedSettings: "सहेजी गई सेटिंग्स",
    themeSummary: (isDark, language) =>
      `थीम: ${isDark ? "डार्क" : "लाइट"} | भाषा: ${language}`,
    recentlyViewed: "हाल ही में देखा गया",
    favouriteMovies: "पसंदीदा फिल्में",
    saveMoviesHint:
      "हार्ट आइकन से फिल्म सेव करें, वह यहां दिखाई देगी।",
    filterForYou: "आपके लिए",
    moviesByGenre: (genre) => `${genre} फिल्में`,
    helpSupportText:
      "जब आप इसे अपने बड़े सिस्टम से जोड़ेंगे, तो इस सेक्शन का उपयोग बुकिंग सहायता, रिफंड गाइडेंस या संपर्क विवरण के लिए कर सकते हैं।",
    openBookingHistory: "बुकिंग हिस्ट्री खोलें",
    loggedInAs: (email) => `लॉग इन: ${email || "अज्ञात उपयोगकर्ता"}`,
    privacyText:
      "थीम और ऐप भाषा की पसंद अब लोकल स्टोरेज में सेव होती है ताकि प्रोफाइल मेनू रिफ्रेश के बाद भी वही रहे।",
    footerBrand: "EliteCine",
    footerText: "फिल्में बुक करें | थियेटर खोजें | आसान पेमेंट",
  },
  Marathi: {
    profile: "प्रोफाइल",
    hello: (name) => `नमस्कार, ${name}`,
    helpSupport: "मदत आणि सपोर्ट",
    favourite: "आवडते",
    bookingHistory: "बुकिंग इतिहास",
    privacySecurity: "गोपनीयता आणि सुरक्षा",
    notification: "सूचना",
    settings: "सेटिंग्स",
    appLanguage: "भाषा (ऍप भाषा)",
    appTheme: "ऍप थीम (डार्क / लाइट)",
    light: "लाइट",
    dark: "डार्क",
    logout: "लॉगआउट",
    myBookings: "माझ्या बुकिंग",
    home: "होम",
    movies: "चित्रपट",
    theatres: "थिएटर्स",
    searchMovies: "चित्रपट शोधा...",
    failedMovies: "चित्रपट लोड झाले नाहीत",
    voiceSearchNotSupported: "व्हॉइस सर्च उपलब्ध नाही",
    featuredMovie: "फीचर्ड चित्रपट",
    bookNow: "आता बुक करा",
    theatresNearMe: (city) => `जवळचे थिएटर्स (${city})`,
    upcoming: (count) => `लवकरच येत आहे (${count})`,
    favouritesCount: (count) => `आवडते (${count})`,
    notifications: "सूचना",
    dashboardUpdates: "डॅशबोर्ड अपडेट्स",
    activeShortcuts: (count) =>
      `तुमच्याकडे ${count} सक्रिय प्रोफाइल शॉर्टकट उपलब्ध आहेत.`,
    readyMessage:
      "तुमचा प्रोफाइल मेनू तयार आहे. वापर सुरू केल्यावर येथे माहिती दिसेल.",
    bookingHistoryInfo:
      "नवीन प्रोफाइल पॅनलमधून थेट तुमचा बुकिंग इतिहास उघडा.",
    savedSettings: "जतन केलेल्या सेटिंग्स",
    themeSummary: (isDark, language) =>
      `थीम: ${isDark ? "डार्क" : "लाइट"} | भाषा: ${language}`,
    recentlyViewed: "अलीकडे पाहिलेले",
    favouriteMovies: "आवडते चित्रपट",
    saveMoviesHint:
      "हार्ट आयकॉनने चित्रपट सेव करा, तो इथे दिसेल.",
    filterForYou: "तुमच्यासाठी",
    moviesByGenre: (genre) => `${genre} चित्रपट`,
    helpSupportText:
      "हे मोठ्या सिस्टममध्ये जोडताना बुकिंग मदत, रिफंड मार्गदर्शन किंवा संपर्क तपशीलासाठी हा विभाग वापरू शकता.",
    openBookingHistory: "बुकिंग इतिहास उघडा",
    loggedInAs: (email) => `लॉग इन: ${email || "अज्ञात वापरकर्ता"}`,
    privacyText:
      "थीम आणि ऍप भाषा पसंती आता लोकल स्टोरेजमध्ये सेव होते, त्यामुळे प्रोफाइल मेनू रिफ्रेशनंतरही तसाच राहतो.",
    footerBrand: "EliteCine",
    footerText: "चित्रपट बुक करा | थिएटर्स शोधा | सोपे पेमेंट",
  },
};

export default function UserDashboard() {
  const navigate = useNavigate();
  const movieRef = useRef(null);
  const profilePanelRef = useRef(null);
  const favoritesSectionRef = useRef(null);
  const notificationsSectionRef = useRef(null);
  const supportSectionRef = useRef(null);
  const privacySectionRef = useRef(null);

  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [recent, setRecent] = useState([]);
  const [dark, setDark] = useState(() => localStorage.getItem("appTheme") === "dark");
  const [sliderIndex, setSliderIndex] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState("For You");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [selectedCity, setSelectedCity] = useState(
    localStorage.getItem("selectedCity") || "Kolhapur"
  );
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(true);
  const { appLanguage, setAppLanguage } = useAppLanguage();
  const text = uiText[appLanguage] || uiText.English;
  const speechLanguage =
    appLanguage === "Hindi"
      ? "hi-IN"
      : appLanguage === "Marathi"
      ? "mr-IN"
      : "en-US";

  /* ================= INIT ================= */
  useEffect(() => {
    const loadMovies = async () => {
      try {
        const res = await getMoviesApi();
        setMovies(res.data);
      } catch {
        alert(text.failedMovies);
      }
    };

    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedUser) {
      navigate("/login");
      return;
    }
    setUser(loggedUser);
    setFavorites(JSON.parse(localStorage.getItem("favorites") || "[]"));
    setRecent(JSON.parse(localStorage.getItem("recent") || "[]"));
    loadMovies();
  }, [navigate, text.failedMovies]);

  /* ================= AUTO SLIDER ================= */
  useEffect(() => {
    if (!movies.length) return;
    const timer = setInterval(() => {
      setSliderIndex((prev) => (prev + 1 >= movies.length ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [movies]);
useEffect(() => {
  if (search.trim() !== "") {
    movieRef.current?.scrollIntoView({ behavior: "smooth" });
  }
}, [search]);
  useEffect(() => {
    localStorage.setItem("appTheme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    if (!profileOpen) return undefined;

    const handleClickOutside = (event) => {
      if (profilePanelRef.current && !profilePanelRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [profileOpen]);

  /* ================= FILTER ================= */
  const languages = ["All", ...new Set(movies.map((m) => m.language).filter(Boolean))];

  const filteredMovies = movies
  .filter((m) => {
    const matchSearch = m.title?.toLowerCase().includes(search.toLowerCase());
    const matchGenre =
      selectedGenre === "For You" ||
      m.genre?.toLowerCase() === selectedGenre.toLowerCase();
    const matchLang =
      selectedLanguage === "All" ||
      m.language?.toLowerCase() === selectedLanguage.toLowerCase();
    return matchSearch && matchGenre && matchLang;
  })
  .sort((a, b) => {
    if (!search) return 0;

    const aStarts = a.title?.toLowerCase().startsWith(search.toLowerCase());
    const bStarts = b.title?.toLowerCase().startsWith(search.toLowerCase());

    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;

    return a.title.localeCompare(b.title);
  });

  const genres = [...new Set(filteredMovies.map((m) => m.genre))];
  const dynamicGenres = ["For You", ...new Set(movies.map((m) => m.genre).filter(Boolean))];

  /* ================= FAVORITES ================= */
  const toggleFavorite = (movie) => {
    let updated;
    if (favorites.find((f) => f._id === movie._id)) {
      updated = favorites.filter((f) => f._id !== movie._id);
    } else {
      updated = [...favorites, movie];
    }
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  /* ================= RECENT ================= */
  const addRecent = (movie) => {
    const updated = [movie, ...recent.filter((r) => r._id !== movie._id)].slice(0, 5);
    setRecent(updated);
    localStorage.setItem("recent", JSON.stringify(updated));
  };

  const removeRecent = (id) => {
    const updated = recent.filter((r) => r._id !== id);
    setRecent(updated);
    localStorage.setItem("recent", JSON.stringify(updated));
  };

  /* ================= UPCOMING ================= */
  const upcomingMovies = movies.filter((m) => m.releaseDate && new Date(m.releaseDate) >= new Date());

  /* ================= VOICE SEARCH ================= */
  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(text.voiceSearchNotSupported);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = speechLanguage;
    recognition.start();
    recognition.onresult = (e) => {
      setSearch(e.results[0][0].transcript);
    };
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/login");
  };

  /* ================= SCROLL ================= */
  const scrollToMovies = () => {
    movieRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToSection = (ref) => {
    setProfileOpen(false);
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const notificationCount = [
    favorites.length > 0,
    upcomingMovies.length > 0,
    recent.length > 0,
  ].filter(Boolean).length;

  return (
    <div className={`${dark ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} min-h-screen flex flex-col`}>
      {/* ================= HEADER ================= */}
      <header
        className={`px-6 py-4 shadow ${
          dark ? "bg-gray-950 text-white" : "bg-white text-black"
        }`}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative" ref={profilePanelRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                dark
                  ? "border-gray-800 bg-gray-900 hover:bg-gray-800"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white">
                <User size={22} />
              </span>
              <span>
                <span className={`block text-xs uppercase tracking-[0.25em] ${dark ? "text-gray-400" : "text-gray-500"}`}>
                  {text.profile}
                </span>
                <span className="block text-2xl font-semibold">{text.hello(user?.name)}</span>
              </span>
              <ChevronDown
                size={18}
                className={`transition ${profileOpen ? "rotate-180" : ""} ${
                  dark ? "text-gray-400" : "text-gray-500"
                }`}
              />
            </button>

            {profileOpen && (
              <div
                className={`absolute left-0 top-full z-20 mt-4 w-[320px] overflow-hidden rounded-[28px] border shadow-2xl ${
                  dark
                    ? "border-gray-800 bg-gray-900 text-white"
                    : "border-gray-200 bg-[#f3f0ed] text-black"
                }`}
              >
                <div className="flex items-start justify-between border-b px-5 py-4">
                  <div>
                    <h2 className="text-2xl font-semibold">{text.profile}</h2>
                    <p className={`mt-1 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
                      {user?.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setProfileOpen(false)}
                    className={`rounded-full p-2 ${dark ? "hover:bg-gray-800" : "hover:bg-white"}`}
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="px-3 py-3">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/user/help-support");
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium ${
                      dark ? "hover:bg-gray-800" : "hover:bg-white"
                    }`}
                  >
                    <Headphones size={18} className="text-red-500" />
                    {text.helpSupport}
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection(favoritesSectionRef)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium ${
                      dark ? "hover:bg-gray-800" : "hover:bg-white"
                    }`}
                  >
                    <Heart size={18} className="text-red-500" />
                    {text.favourite}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/my-bookings");
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium ${
                      dark ? "hover:bg-gray-800" : "hover:bg-white"
                    }`}
                  >
                    <Ticket size={18} className="text-red-500" />
                    {text.bookingHistory}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/user/privacy-security");
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium ${
                      dark ? "hover:bg-gray-800" : "hover:bg-white"
                    }`}
                  >
                    <Shield size={18} className="text-red-500" />
                    {text.privacySecurity}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/user/notifications");
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium ${
                      dark ? "hover:bg-gray-800" : "hover:bg-white"
                    }`}
                  >
                    <Bell size={18} className="text-red-500" />
                    {text.notification}
                    {notificationCount > 0 && (
                      <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                        {notificationCount}
                      </span>
                    )}
                  </button>
                </div>

                <div className="border-t px-5 py-4">
                  <button
                    type="button"
                    onClick={() => setSettingsOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between text-left"
                  >
                    <span className="font-semibold">{text.settings}</span>
                    <ChevronDown
                      size={18}
                      className={`transition ${settingsOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {settingsOpen && (
                    <div className="mt-4 space-y-4">
                      <div
                        className={`rounded-2xl border px-4 py-3 ${
                          dark ? "border-gray-800 bg-gray-950" : "border-gray-200 bg-white"
                        }`}
                      >
                        <label className={`mb-2 block text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
                          {text.appLanguage}
                        </label>
                        <select
                          value={appLanguage}
                          onChange={(e) => setAppLanguage(e.target.value)}
                          className={`w-full bg-transparent text-sm font-medium outline-none ${
                            dark ? "text-black" : "text-white"
                          }`}
                        >
                          <option value="English">English</option>
                          <option value="Hindi">Hindi</option>
                          <option value="Marathi">Marathi</option>
                        </select>
                      </div>

                      <div
                        className={`rounded-2xl border px-4 py-3 ${
                          dark ? "border-gray-800 bg-gray-950" : "border-gray-200 bg-white"
                        }`}
                      >
                        <p className={`mb-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
                          {text.appTheme}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setDark(false)}
                            className={`flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                              !dark ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            <Sun size={16} />
                            {text.light}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDark(true)}
                            className={`flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                              dark ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            <Moon size={16} />
                            {text.dark}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-red-500 px-4 py-3 text-sm font-semibold text-white"
                  >
                    <LogOut size={16} />
                    {text.logout}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={() => navigate("/my-bookings")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition shadow-sm
                ${
                  dark
                    ? "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                    : "bg-white text-black hover:bg-gray-50 border border-gray-200"
                }`}
            >
              <Ticket size={18} className="text-red-500" />
              {text.myBookings}
            </button>

            <div
              className={`flex items-center border px-3 py-2 rounded-lg ${
                dark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
              }`}
            >
              <MapPin size={16} className="text-orange-500 mr-1" />
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  localStorage.setItem("selectedCity", e.target.value);
                }}
                className={`outline-none text-sm bg-transparent font-medium ${
                  dark ? "text-white" : "text-black"
                }`}
              >
                <option value="Mumbai">Mumbai</option>
                <option value="Pune">Pune</option>
                <option value="Kolhapur">Kolhapur</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className={`h-[1px] ${dark ? "bg-gray-800" : "bg-gray-300"}`}></div>

      {/* ================= NAVBAR ================= */}
      <nav
        className={`border-b px-6 py-3 flex items-center relative ${
          dark ? "bg-gray-950 border-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <div onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-2 text-orange-500 font-bold text-xl cursor-pointer absolute left-6">
          <Clapperboard size={26} /> EliteCine
        </div>
        <div className={`mx-auto flex gap-6 font-medium ${dark ? "text-gray-300" : "text-gray-600"}`}>
          <button onClick={() => window.scrollTo(0, 0)} className="flex gap-1 hover:text-orange-500"><Home size={18} /> {text.home}</button>
          <button onClick={scrollToMovies} className="flex gap-1 hover:text-orange-500"><Film size={18} /> {text.movies}</button>
          <button 
            onClick={() => navigate("/theatres")} 
            className="flex gap-1 hover:text-orange-500"
          >
            <MapPin size={18} /> {text.theatres}
          </button>
        </div>
        <div className="relative w-[300px] absolute right-6">
          <input
            type="text"
            placeholder={text.searchMovies}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full border rounded-full px-4 py-2 pr-10 outline-none ${
              dark
                ? "border-gray-700 bg-gray-900 text-white placeholder:text-gray-500"
                : "text-black"
            }`}
          />
          <button
            onClick={handleVoiceSearch}
            className={`absolute right-3 top-2 ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            <Mic size={18} />
          </button>
        </div>
      </nav>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-10">
        {/* Featured Slider */}
        {movies.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4">{text.featuredMovie}</h3>
            <div className="relative overflow-hidden rounded-2xl shadow bg-white border border-orange-200 text-black">
              <div className="flex transition-transform duration-700" style={{ transform: `translateX(-${sliderIndex * 100}%)` }}>
                {movies.map((m) => (
                  <div key={m._id} className="w-full flex-shrink-0 flex items-center p-6 gap-8">
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold mb-3">{m.title}</h2>
                      <p className="text-gray-500 mb-3">{m.language} • {m.genre}</p>
                      <button onClick={() => { addRecent(m); navigate(`/moviedetail/${m._id}`); }} className="px-6 py-2 bg-red-500 text-white rounded">{text.bookNow}</button>
                    </div>
                    <div className="w-[250px]">
                      <img src={m.poster || '/default.png'} className="w-full h-[350px] object-cover rounded-xl shadow cursor-pointer" onClick={() => { addRecent(m); navigate(`/moviedetail/${m._id}`); }} alt={m.title} />
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setSliderIndex(sliderIndex - 1 < 0 ? movies.length - 1 : sliderIndex - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white border border-orange-200 text-orange-500 p-2 rounded-full shadow"><ChevronLeft /></button>
              <button onClick={() => setSliderIndex(sliderIndex + 1 >= movies.length ? 0 : sliderIndex + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white border border-orange-200 text-orange-500 p-2 rounded-full shadow"><ChevronRight /></button>
            </div>
          </div>
        )}

        {/* Theatre + Upcoming */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div
            onClick={() => navigate("/theatres")}
            className={`p-6 rounded-xl shadow cursor-pointer text-center font-semibold transition-colors ${
              dark ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-white text-black hover:bg-orange-50"
            }`}
          >
            {text.theatresNearMe(selectedCity)}
          </div>
          <div
            onClick={() => navigate("/upcoming-movies")}
            className={`p-6 rounded-xl shadow cursor-pointer text-center font-semibold transition-colors ${
              dark ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-white text-black hover:bg-orange-50"
            }`}
          >
            {text.upcoming(upcomingMovies.length)}
          </div>
          <div
            onClick={scrollToMovies}
            className={`p-6 rounded-xl shadow cursor-pointer text-center font-semibold transition-colors ${
              dark ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-white text-black hover:bg-orange-50"
            }`}
          >
            {text.favouritesCount(favorites.length)}
          </div>
        </div>

        <div ref={notificationsSectionRef} className="mb-10">
          <h3 className="text-xl font-semibold mb-4">{text.notifications}</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className={`${dark ? "bg-gray-800 text-white" : "bg-white text-black"} rounded-xl shadow p-5`}>
              <div className="flex items-center gap-3 mb-3">
                <Bell size={18} className="text-red-500" />
                <h4 className="font-semibold">{text.dashboardUpdates}</h4>
              </div>
              <p className={`${dark ? "text-gray-300" : "text-gray-500"} text-sm`}>
                {notificationCount > 0
                  ? text.activeShortcuts(notificationCount)
                  : text.readyMessage}
              </p>
            </div>
            <div className={`${dark ? "bg-gray-800 text-white" : "bg-white text-black"} rounded-xl shadow p-5`}>
              <div className="flex items-center gap-3 mb-3">
                <Ticket size={18} className="text-red-500" />
                <h4 className="font-semibold">{text.bookingHistory}</h4>
              </div>
              <p className={`${dark ? "text-gray-300" : "text-gray-500"} text-sm`}>
                {text.bookingHistoryInfo}
              </p>
            </div>
            <div className={`${dark ? "bg-gray-800 text-white" : "bg-white text-black"} rounded-xl shadow p-5`}>
              <div className="flex items-center gap-3 mb-3">
                <Globe size={18} className="text-red-500" />
                <h4 className="font-semibold">{text.savedSettings}</h4>
              </div>
              <p className={`${dark ? "text-gray-300" : "text-gray-500"} text-sm`}>
                {text.themeSummary(dark, appLanguage)}
              </p>
            </div>
          </div>
        </div>

        {/* Recently Viewed */}
        {recent.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-4">{text.recentlyViewed}</h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {recent.map((m) => (
                <div key={m._id} className="relative bg-white p-3 rounded-xl shadow min-w-[220px] text-black">
                  <X size={16} onClick={() => removeRecent(m._id)} className="absolute right-2 top-2 cursor-pointer text-red-500" />
                  <img src={m.poster || '/default.png'} className="w-16 h-24 object-cover rounded cursor-pointer" alt={m.title} />
                  <h4 className="text-red-500 font-bold mt-2 truncate">{m.title}</h4>
                  <p className="text-sm text-gray-500">{m.language}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div ref={favoritesSectionRef} className="mb-10">
          <h3 className="text-xl font-semibold mb-4">{text.favouriteMovies}</h3>
          {favorites.length > 0 ? (
            <div className="grid md:grid-cols-4 gap-6">
              {favorites.map((movie) => (
                <div
                  key={movie._id}
                  className={`rounded-xl shadow overflow-hidden ${
                    dark ? "bg-gray-800 text-white" : "bg-white text-black"
                  }`}
                >
                  <img
                    src={movie.poster || "/default.png"}
                    className="h-60 w-full object-cover cursor-pointer"
                    onClick={() => {
                      addRecent(movie);
                      navigate(`/moviedetail/${movie._id}`);
                    }}
                    alt={movie.title}
                  />
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-red-500 truncate max-w-[180px]">{movie.title}</h4>
                      <p className={`text-sm ${dark ? "text-gray-300" : "text-gray-500"}`}>
                        {movie.language || "-"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(movie)}
                      className="rounded-full bg-red-50 p-2 text-red-500"
                    >
                      <Heart size={18} className="fill-current" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`${dark ? "bg-gray-800 text-gray-200" : "bg-white text-gray-500"} rounded-xl shadow p-6`}>
              {text.saveMoviesHint}
            </div>
          )}
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {dynamicGenres.map((g) => (
            <button key={g} onClick={() => setSelectedGenre(g)} className={`px-4 py-2 rounded-full shadow-sm font-medium transition ${selectedGenre === g ? "bg-red-500 text-white" : "bg-white text-black"}`}>{g === "For You" ? text.filterForYou : g}</button>
          ))}
          <div className="ml-auto flex gap-2 items-center bg-white px-4 py-2 rounded-full shadow-sm text-black">
            <Globe size={18} className="text-gray-500" />
            <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="bg-transparent outline-none cursor-pointer font-medium">
              {languages.map((l) => (<option key={l} value={l}>{l}</option>))}
            </select>
          </div>
        </div>

        {/* Movies by Genre */}
        <div ref={movieRef}>
          {genres.map((genre) => (
            <div key={genre} className="mb-12">
              <h3 className="text-xl font-semibold mb-4">{text.moviesByGenre(genre)}</h3>
              <div className="grid md:grid-cols-4 gap-6">
                {filteredMovies.filter((m) => m.genre === genre).map((m) => (
                  <div key={m._id} className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden text-black">
                    <img src={m.poster || '/default.png'} className="h-60 w-full object-cover cursor-pointer" onClick={() => { addRecent(m); navigate(`/moviedetail/${m._id}`); }} alt={m.title} />
                    <div className="p-4 flex justify-between items-center">
                      <h4 className="font-bold text-red-500 truncate mr-2">{m.title}</h4>
                      <Heart onClick={() => toggleFavorite(m)} className={`cursor-pointer flex-shrink-0 ${favorites.find(f => f._id === m._id) ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div
            ref={supportSectionRef}
            className={`${dark ? "bg-gray-800 text-white" : "bg-white text-black"} rounded-xl shadow p-6`}
          >
            <div className="flex items-center gap-3 mb-3">
              <Headphones size={18} className="text-red-500" />
              <h3 className="text-xl font-semibold">{text.helpSupport}</h3>
            </div>
            <p className={`${dark ? "text-gray-300" : "text-gray-500"} text-sm mb-4`}>
              {text.helpSupportText}
            </p>
            <button
              type="button"
              onClick={() => navigate("/my-bookings")}
              className="px-4 py-2 rounded bg-red-500 text-white font-semibold"
            >
              {text.openBookingHistory}
            </button>
          </div>

          <div
            ref={privacySectionRef}
            className={`${dark ? "bg-gray-800 text-white" : "bg-white text-black"} rounded-xl shadow p-6`}
          >
            <div className="flex items-center gap-3 mb-3">
              <Shield size={18} className="text-red-500" />
              <h3 className="text-xl font-semibold">{text.privacySecurity}</h3>
            </div>
            <p className={`${dark ? "text-gray-300" : "text-gray-500"} text-sm mb-2`}>
              {text.loggedInAs(user?.email)}
            </p>
            <p className={`${dark ? "text-gray-300" : "text-gray-500"} text-sm`}>
              {text.privacyText}
            </p>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer
        className={`border-t px-6 py-6 text-center text-sm ${
          dark ? "bg-gray-950 border-gray-800 text-gray-400" : "bg-white text-gray-600"
        }`}
      >
        <p className="font-semibold text-orange-500 mb-1">{text.footerBrand}</p>
        <p>{text.footerText}</p>
        <p className="mt-2">© {new Date().getFullYear()} {text.footerBrand}. All rights reserved.</p>
      </footer>
    </div>
  );
}