import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMoviesApi } from "../../Services/MovieApi";
import { useAppLanguage } from "../../i18n/useAppLanguage";

const theatreMoviesText = {
  English: { back: "Back", title: "Movies", empty: "No movies found" },
  Hindi: { back: "वापस", title: "फिल्में", empty: "कोई फिल्म नहीं मिली" },
  Marathi: { back: "मागे", title: "चित्रपट", empty: "कोणताही चित्रपट मिळाला नाही" },
};

export default function TheatreMovies() {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();
  const { appLanguage } = useAppLanguage();
  const text = theatreMoviesText[appLanguage] || theatreMoviesText.English;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await getMoviesApi();
        setMovies(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <button onClick={() => navigate(-1)} className="text-red-500 mb-4">
        {text.back}
      </button>

      <h2 className="text-3xl font-bold mb-6">{text.title}</h2>

      {movies.length === 0 ? (
        <p>{text.empty}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div key={movie._id} className="bg-white p-4 rounded shadow">
              <img src={movie.poster} alt={movie.title} className="h-60 w-full object-cover" />
              <p className="text-center font-semibold mt-2">{movie.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
