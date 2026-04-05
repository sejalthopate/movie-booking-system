import React, { useEffect, useState } from "react";
import { MapPin, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMoviesApi } from "../Services/MovieApi";
import { useAppLanguage } from "../i18n/useAppLanguage";

import hero1 from "../assets/bookticket.jpg";
import hero2 from "../assets/theatre.webp";
import hero3 from "../assets/theatrenear.jpeg";
import logo from "../assets/elitectine-logo.jpeg";

const homeText = {
  English: {
    login: "Login",
    exploreMovies: "Explore Movies",
    viewTheatres: "View Theatres",
    nowShowing: "Now Showing",
    noMoviesAvailable: "No movies available",
    untitled: "Untitled",
    genreNA: "Genre N/A",
    bookNow: "Book Now",
    whyChoose: "Why Choose EliteCine?",
    fastBooking: "Fast Booking",
    securePayment: "Secure Payment",
    bestSeats: "Best Seats",
    easyToUse: "Easy to Use",
    howItWorks: "How It Works",
    step1: "1. Login",
    step2: "2. Select Movie",
    step3: "3. Choose Seat",
    step4: "4. Pay & Enjoy",
    bookings: "Bookings",
    movies: "Movies",
    theatres: "Theatres",
    ratings: "Ratings",
    footerRights: "All Rights Reserved",
    craftedBy: "Crafted by Team EliteCine",
    heroBanners: [
      { title: "Book Movie Tickets Online", subtitle: "Movies | Theatres | Seats" },
      { title: "Experience Cinema Like Never Before", subtitle: "Big Screen | Dolby Sound" },
      { title: "Find Theatres Near You", subtitle: "Easy Booking | Fast Payments" },
    ],
  },
  Hindi: {
    login: "लॉगिन",
    exploreMovies: "फिल्में देखें",
    viewTheatres: "थियेटर देखें",
    nowShowing: "अभी चल रही फिल्में",
    noMoviesAvailable: "कोई फिल्म उपलब्ध नहीं है",
    untitled: "बिना शीर्षक",
    genreNA: "श्रेणी उपलब्ध नहीं",
    bookNow: "अभी बुक करें",
    whyChoose: "EliteCine क्यों चुनें?",
    fastBooking: "तेज़ बुकिंग",
    securePayment: "सुरक्षित भुगतान",
    bestSeats: "बेहतरीन सीटें",
    easyToUse: "आसान उपयोग",
    howItWorks: "यह कैसे काम करता है",
    step1: "1. लॉगिन",
    step2: "2. फिल्म चुनें",
    step3: "3. सीट चुनें",
    step4: "4. भुगतान करें और आनंद लें",
    bookings: "बुकिंग",
    movies: "फिल्में",
    theatres: "थियेटर",
    ratings: "रेटिंग",
    footerRights: "सभी अधिकार सुरक्षित",
    craftedBy: "टीम EliteCine द्वारा निर्मित",
    heroBanners: [
      { title: "ऑनलाइन मूवी टिकट बुक करें", subtitle: "फिल्में | थियेटर | सीटें" },
      { title: "सिनेमा का नया अनुभव लें", subtitle: "बड़ी स्क्रीन | डॉल्बी साउंड" },
      { title: "अपने पास के थियेटर खोजें", subtitle: "आसान बुकिंग | तेज़ भुगतान" },
    ],
  },
  Marathi: {
    login: "लॉगिन",
    exploreMovies: "चित्रपट पाहा",
    viewTheatres: "थिएटर्स पहा",
    nowShowing: "सध्या सुरू असलेले चित्रपट",
    noMoviesAvailable: "कोणतेही चित्रपट उपलब्ध नाहीत",
    untitled: "शीर्षक नाही",
    genreNA: "प्रकार उपलब्ध नाही",
    bookNow: "आता बुक करा",
    whyChoose: "EliteCine का निवडावे?",
    fastBooking: "जलद बुकिंग",
    securePayment: "सुरक्षित पेमेंट",
    bestSeats: "सर्वोत्तम सीट्स",
    easyToUse: "वापरण्यास सोपे",
    howItWorks: "हे कसे काम करते",
    step1: "1. लॉगिन",
    step2: "2. चित्रपट निवडा",
    step3: "3. सीट निवडा",
    step4: "4. पेमेंट करा आणि आनंद घ्या",
    bookings: "बुकिंग",
    movies: "चित्रपट",
    theatres: "थिएटर्स",
    ratings: "रेटिंग",
    footerRights: "सर्व हक्क राखीव",
    craftedBy: "टीम EliteCine कडून तयार",
    heroBanners: [
      { title: "ऑनलाइन चित्रपट तिकीट बुक करा", subtitle: "चित्रपट | थिएटर्स | सीट्स" },
      { title: "सिनेमाचा नवीन अनुभव घ्या", subtitle: "मोठी स्क्रीन | डॉल्बी साउंड" },
      { title: "तुमच्या जवळचे थिएटर्स शोधा", subtitle: "सोपे बुकिंग | जलद पेमेंट" },
    ],
  },
};

export default function HomePage() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const { appLanguage } = useAppLanguage();
  const text = homeText[appLanguage] || homeText.English;

  const heroBanners = [
    { id: 1, title: text.heroBanners[0].title, subtitle: text.heroBanners[0].subtitle, image: hero1 },
    { id: 2, title: text.heroBanners[1].title, subtitle: text.heroBanners[1].subtitle, image: hero2 },
    { id: 3, title: text.heroBanners[2].title, subtitle: text.heroBanners[2].subtitle, image: hero3 },
  ];

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await getMoviesApi();
        setMovies(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % heroBanners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [heroBanners.length]);

  const prevSlide = () =>
    setCurrentBanner(currentBanner === 0 ? heroBanners.length - 1 : currentBanner - 1);
  const nextSlide = () => setCurrentBanner((currentBanner + 1) % heroBanners.length);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="flex justify-between items-center px-6 py-4 shadow">
        <div className="flex items-center gap-2">
          <img src={logo || "/default.png"} alt="EliteCine Logo" className="w-10 h-10 object-contain" />
          <h1 className="text-2xl font-bold text-orange-600">EliteCine</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center border px-2 py-1 rounded">
            <MapPin size={16} className="text-orange-500" />
            <select
              className="outline-none text-sm ml-1"
              defaultValue={localStorage.getItem("selectedCity") || "Kolhapur"}
              onChange={(e) => {
                localStorage.setItem("selectedCity", e.target.value);
              }}
            >
              <option value="Kolhapur">Kolhapur</option>
              <option value="Pune">Pune</option>
              <option value="Mumbai">Mumbai</option>
            </select>
          </div>
          <button onClick={() => navigate("/login")} className="bg-orange-500 text-white px-4 py-1 rounded">
            {text.login}
          </button>
        </div>
      </nav>

      <section className="relative h-[65vh] overflow-hidden">
        {heroBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentBanner ? "opacity-100" : "opacity-0"}`}
            style={{
              backgroundImage: `url(${banner.image || "/default.png"})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="h-full w-full bg-gradient-to-t from-black/70 via-black/40 to-black/20 flex flex-col justify-center items-center text-center text-white px-4">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow">{banner.title}</h2>
              <p className="text-lg mb-6 text-gray-200">{banner.subtitle}</p>
              <div className="flex gap-4">
                <button onClick={() => navigate("/login")} className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded font-semibold transition">
                  {text.exploreMovies}
                </button>
                <button onClick={() => navigate("/login")} className="border border-white px-6 py-2 rounded hover:bg-white hover:text-orange-600 transition">
                  {text.viewTheatres}
                </button>
              </div>
            </div>
          </div>
        ))}

        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60">
          <ChevronLeft />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60">
          <ChevronRight />
        </button>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {heroBanners.map((_, i) => (
            <button key={i} onClick={() => setCurrentBanner(i)} className={`w-3 h-3 rounded-full ${currentBanner === i ? "bg-orange-500" : "bg-white/60"}`} />
          ))}
        </div>
      </section>

      <section className="px-6 py-12 bg-gray-50 flex-grow">
        <h3 className="text-2xl font-bold text-orange-600 mb-8">{text.nowShowing}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {movies.length === 0 ? (
            <p>{text.noMoviesAvailable}</p>
          ) : (
            movies.map((movie) => (
              <div key={movie._id} className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition">
                <img
                  src={movie.poster || "/default.png"}
                  alt={movie.title || text.untitled}
                  className="h-[380px] w-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-4">
                  <h4 className="text-white font-bold text-lg">{movie.title || text.untitled}</h4>
                  <p className="text-gray-300 text-sm mb-3">{movie.genre || text.genreNA}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="flex items-center gap-1 text-orange-400">
                      <Star size={14} /> {movie.rating || "N/A"}
                    </span>
                    <button onClick={() => navigate("/login")} className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-3 rounded font-semibold">
                      {text.bookNow}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="px-6 py-12 bg-white text-center">
        <h2 className="text-3xl font-bold text-orange-600 mb-8">{text.whyChoose}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-4 shadow rounded">{text.fastBooking}</div>
          <div className="p-4 shadow rounded">{text.securePayment}</div>
          <div className="p-4 shadow rounded">{text.bestSeats}</div>
          <div className="p-4 shadow rounded">{text.easyToUse}</div>
        </div>
      </section>

      <section className="px-6 py-12 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold text-orange-600 mb-8">{text.howItWorks}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-4 bg-white shadow rounded">{text.step1}</div>
          <div className="p-4 bg-white shadow rounded">{text.step2}</div>
          <div className="p-4 bg-white shadow rounded">{text.step3}</div>
          <div className="p-4 bg-white shadow rounded">{text.step4}</div>
        </div>
      </section>

      <section className="px-6 py-12 bg-orange-500 text-white text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-bold">
          <div>
            <p className="text-3xl">10K+</p>
            <p>{text.bookings}</p>
          </div>
          <div>
            <p className="text-3xl">500+</p>
            <p>{text.movies}</p>
          </div>
          <div>
            <p className="text-3xl">50+</p>
            <p>{text.theatres}</p>
          </div>
          <div>
            <p className="text-3xl">5+</p>
            <p>{text.ratings}</p>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 text-center py-6">
        <p className="text-sm">© 2026 EliteCine | {text.footerRights}</p>
        <p className="mt-2 text-orange-400 font-semibold">{text.craftedBy}</p>
        <p className="mt-1 text-sm">Swanandi | Sejal | Srushti | Samiksha</p>
      </footer>
    </div>
  );
}
