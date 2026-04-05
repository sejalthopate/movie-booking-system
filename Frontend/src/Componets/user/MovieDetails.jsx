import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X, Play } from "lucide-react";
import { getMoviesApi } from "../../Services/MovieApi";
import { getCoupons } from "../../Services/TACouponApi";
import { useAppLanguage } from "../../i18n/useAppLanguage";

const movieDetailsText = {
  English: {
    loading: "Loading...",
    back: "Back",
    language: "Language",
    genre: "Genre",
    duration: "Duration",
    releaseDate: "Release Date",
    watchTrailer: (language) => `Watch ${language} Trailer`,
    availableOffers: "Available Offers",
    noOffers: "No offers available",
    getOff: (value) => `Get ${value}% OFF`,
    flatOff: (value) => `Flat Rs.${value} OFF`,
    valid: "Valid",
    cast: "Cast",
    crew: "Crew",
    youMayLike: "You Might Also Like",
    seeAll: "See All",
    bookTicket: "Book Ticket",
    na: "N/A",
  },
  Hindi: {
    loading: "लोड हो रहा है...",
    back: "वापस",
    language: "भाषा",
    genre: "श्रेणी",
    duration: "अवधि",
    releaseDate: "रिलीज़ डेट",
    watchTrailer: (language) => `${language} ट्रेलर देखें`,
    availableOffers: "उपलब्ध ऑफर",
    noOffers: "कोई ऑफर उपलब्ध नहीं है",
    getOff: (value) => `${value}% की छूट पाएं`,
    flatOff: (value) => `सीधी Rs.${value} की छूट`,
    valid: "मान्य",
    cast: "कलाकार",
    crew: "क्रू",
    youMayLike: "आपको यह भी पसंद आ सकता है",
    seeAll: "सभी देखें",
    bookTicket: "टिकट बुक करें",
    na: "उपलब्ध नहीं",
  },
  Marathi: {
    loading: "लोड होत आहे...",
    back: "मागे",
    language: "भाषा",
    genre: "प्रकार",
    duration: "कालावधी",
    releaseDate: "रिलीज तारीख",
    watchTrailer: (language) => `${language} ट्रेलर पहा`,
    availableOffers: "उपलब्ध ऑफर्स",
    noOffers: "ऑफर्स उपलब्ध नाहीत",
    getOff: (value) => `${value}% सूट मिळवा`,
    flatOff: (value) => `थेट Rs.${value} सूट`,
    valid: "वैध",
    cast: "कलाकार",
    crew: "क्रू",
    youMayLike: "तुम्हाला हेही आवडू शकते",
    seeAll: "सर्व पहा",
    bookTicket: "तिकीट बुक करा",
    na: "उपलब्ध नाही",
  },
};

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theatreId = "THEATRE_001";
  const { appLanguage } = useAppLanguage();
  const text = movieDetailsText[appLanguage] || movieDetailsText.English;

  const [movie, setMovie] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [detailsHeight, setDetailsHeight] = useState(0);
  const [allMovies, setAllMovies] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [selectedTrailer, setSelectedTrailer] = useState("");
  const detailsRef = useRef(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await getMoviesApi();
        const found = res.data.find((item) => item._id === id);
        setMovie(found);
        setAllMovies(res.data.filter((item) => item._id !== id));
      } catch (err) {
        console.error(err);
      }
    };

    fetchMovie();
  }, [id]);

  useEffect(() => {
    if (id && theatreId) {
      getCoupons(theatreId, id)
        .then((res) => {
          setCoupons(res.data || []);
        })
        .catch((err) => console.error("Coupon fetch error:", err));
    }
  }, [id, theatreId]);

  useEffect(() => {
    if (detailsRef.current) setDetailsHeight(detailsRef.current.clientHeight);
  }, [movie]);

  if (!movie) return <p className="p-6">{text.loading}</p>;

  const renderPersonCard = (person, extra = "") => (
    <div
      key={person._id}
      onClick={() => navigate(`/persondetail/${person._id}`)}
      className="flex flex-col items-center w-24 text-center cursor-pointer hover:scale-105 transition"
    >
      <img
        src={person.photo || "/fallback-profile.png"}
        alt={person.name}
        className="w-20 h-20 object-cover rounded-full mb-1"
      />
      <p className="text-sm font-medium">{person.name}</p>
      {extra && <p className="text-xs text-gray-500">{extra}</p>}
    </div>
  );

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 bg-red-500 text-white rounded">
        {text.back}
      </button>

      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative">
            <img
              src={movie.poster}
              alt={movie.title}
              className="rounded-xl"
              style={{ height: `${detailsHeight}px` }}
            />
            {movie.trailers?.length > 0 && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 p-3 rounded-full">
                <Play size={24} color="white" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-3" ref={detailsRef}>
            <h2 className="text-3xl font-bold">{movie.title}</h2>
            <p><b>{text.language}:</b> {movie.language}</p>
            <p><b>{text.genre}:</b> {movie.genre}</p>
            <p><b>{text.duration}:</b> {movie.duration}</p>
            <p><b>{text.releaseDate}:</b> {new Date(movie.releaseDate).toLocaleDateString()}</p>

            {movie.trailers?.length > 0 && (
              <div className="mt-4 flex gap-3 flex-wrap">
                {movie.trailers.map((trailer, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedTrailer(trailer.url);
                      setShowTrailer(true);
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    {text.watchTrailer(trailer.language)}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2 text-orange-600">{text.availableOffers}</h3>

              {coupons.length === 0 ? (
                <p className="text-gray-500">{text.noOffers}</p>
              ) : (
                coupons.map((coupon) => (
                  <div key={coupon._id} className="border-l-4 border-orange-500 rounded p-3 mb-2 bg-white shadow-sm">
                    <p className="font-bold text-orange-600">{coupon.code}</p>
                    <p className="text-gray-700">
                      {coupon.discountType === "PERCENTAGE"
                        ? text.getOff(coupon.discountValue)
                        : text.flatOff(coupon.discountValue)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {text.valid}: {coupon.validFrom?.slice(0, 10)} - {coupon.validTill?.slice(0, 10)}
                    </p>
                  </div>
                ))
              )}
            </div>

            {selectedTrailer && showTrailer && (
              <div
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]"
                onClick={() => setShowTrailer(false)}
              >
                <div className="relative w-[90%] md:w-[60%]" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setShowTrailer(false)}
                    className="absolute -top-10 right-0 bg-white text-black rounded-full p-2 shadow-lg z-[10000] hover:bg-gray-200 transition"
                  >
                    <X size={20} />
                  </button>

                  <video src={selectedTrailer} controls autoPlay className="w-full rounded-lg" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">{text.cast}</h3>
          <div className="flex gap-4 flex-wrap">
            {movie.cast?.length ? movie.cast.map((cast) => cast.person && renderPersonCard(cast.person, cast.character)) : text.na}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">{text.crew}</h3>
          <div className="flex flex-wrap gap-4">
            {movie.crew?.length > 0 ? movie.crew.map((crew) => crew && renderPersonCard(crew, crew.role)) : <p>{text.na}</p>}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">{text.youMayLike}</h3>
          <div className="flex gap-4 overflow-x-auto flex-nowrap">
            {allMovies.slice(0, 5).map((item) => (
              <div
                key={item._id}
                className="flex-shrink-0 w-32 cursor-pointer"
                onClick={() => navigate(`/moviedetail/${item._id}`)}
              >
                <img src={item.poster} alt={item.title} className="w-full h-48 object-cover rounded-lg shadow" />
                <p className="text-sm text-center mt-1">{item.title}</p>
              </div>
            ))}

            {allMovies.length > 5 && (
              <div className="flex-shrink-0 w-32 flex items-center justify-center border rounded-lg cursor-pointer text-center font-medium" onClick={() => navigate("/allmovies")}>
                {text.seeAll}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => navigate(`/movie/${movie._id}`)}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-lg"
        >
          {text.bookTicket}
        </button>
      </div>
    </div>
  );
}
