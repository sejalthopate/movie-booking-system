import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { getMoviesApi } from "../../Services/MovieApi";
import { useAppLanguage } from "../../i18n/useAppLanguage";

const allMoviesText = {
  English: { title: "All Movies" },
  Hindi: { title: "सभी फिल्में" },
  Marathi: { title: "सर्व चित्रपट" },
};

export default function AllMovies() {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState({});
  const navigate = useNavigate();
  const { appLanguage } = useAppLanguage();
  const text = allMoviesText[appLanguage] || allMoviesText.English;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await getMoviesApi();
        setMovies(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMovies();
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <h2 className="text-3xl font-bold mb-6">{text.title}</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <div key={movie._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden relative">
            <div className="absolute top-2 right-2 z-10 cursor-pointer" onClick={() => toggleFavorite(movie._id)}>
              <Heart size={24} className="text-red-500" fill={favorites[movie._id] ? "red" : "none"} />
            </div>

            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-64 object-cover cursor-pointer"
              onClick={() => navigate(`/moviedetail/${movie._id}`)}
            />

            <p className="text-center font-semibold text-lg p-2">{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
