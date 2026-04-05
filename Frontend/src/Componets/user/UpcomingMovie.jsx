import React, { useEffect, useState } from "react";
import { getMoviesApi } from "../../Services/MovieApi";
import { useAppLanguage } from "../../i18n/useAppLanguage";

const upcomingText = {
  English: {
    title: "Upcoming Movies",
    loading: "Loading...",
    empty: "No upcoming movies found",
    upcoming: "Upcoming",
    genre: "Genre",
    language: "Language",
    duration: "Duration",
    release: "Release",
    daysToRelease: (days) => `${days} day${days > 1 ? "s" : ""} to release`,
    comingSoon: "Coming Soon",
    na: "N/A",
  },
  Hindi: {
    title: "आने वाली फिल्में",
    loading: "लोड हो रहा है...",
    empty: "कोई आने वाली फिल्म नहीं मिली",
    upcoming: "जल्द आ रही",
    genre: "श्रेणी",
    language: "भाषा",
    duration: "अवधि",
    release: "रिलीज़",
    daysToRelease: (days) => `रिलीज़ में ${days} दिन`,
    comingSoon: "जल्द आ रहा है",
    na: "उपलब्ध नहीं",
  },
  Marathi: {
    title: "लवकरच येणारे चित्रपट",
    loading: "लोड होत आहे...",
    empty: "लवकरच येणारे चित्रपट मिळाले नाहीत",
    upcoming: "लवकरच",
    genre: "प्रकार",
    language: "भाषा",
    duration: "कालावधी",
    release: "रिलीज",
    daysToRelease: (days) => `रिलीजसाठी ${days} दिवस बाकी`,
    comingSoon: "लवकरच येत आहे",
    na: "उपलब्ध नाही",
  },
};

export default function UpcomingMovies() {
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const { appLanguage } = useAppLanguage();
  const text = upcomingText[appLanguage] || upcomingText.English;

  const getDaysLeft = (releaseDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const release = new Date(releaseDate);
    release.setHours(0, 0, 0, 0);

    const diff = release - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const res = await getMoviesApi();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingMovies = res.data.filter((movie) => {
          if (!movie.releaseDate) return false;
          const release = new Date(movie.releaseDate);
          release.setHours(0, 0, 0, 0);
          return release > today;
        });

        setUpcoming(upcomingMovies);
      } catch (err) {
        console.error("Upcoming fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcoming();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold mb-6">{text.title}</h2>

      {loading && <p>{text.loading}</p>}

      {!loading && upcoming.length === 0 && (
        <p className="text-red-500 font-semibold">{text.empty}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {upcoming.map((movie) => {
          const daysLeft = getDaysLeft(movie.releaseDate);

          return (
            <div key={movie._id} className="relative bg-white rounded-xl shadow overflow-hidden">
              <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-3 py-1 rounded-full">
                {text.upcoming}
              </span>

              <img src={movie.poster} alt={movie.title} className="h-60 w-full object-cover" />

              <div className="p-4">
                <h3 className="font-bold text-lg text-red-600">{movie.title}</h3>
                <p className="text-sm">
                  <b>{text.genre}:</b> {movie.genre || text.na}
                </p>
                <p className="text-sm">
                  <b>{text.language}:</b> {movie.language || text.na}
                </p>
                <p className="text-sm">
                  <b>{text.duration}:</b> {movie.duration || text.na}
                </p>
                <p className="text-sm">
                  <b>{text.release}:</b> {new Date(movie.releaseDate).toLocaleDateString()}
                </p>

                <p className="mt-2 text-red-600 font-semibold">{text.daysToRelease(daysLeft)}</p>

                <button disabled className="mt-3 w-full bg-gray-400 text-white py-2 rounded cursor-not-allowed">
                  {text.comingSoon}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
