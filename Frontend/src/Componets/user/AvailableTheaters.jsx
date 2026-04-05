import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppLanguage } from "../../i18n/useAppLanguage";

const theatreText = {
  English: {
    loading: "Loading theatres...",
    empty: "No theatres available for selected city",
    title: "Available Theatres",
    screens: "Screens",
  },
  Hindi: {
    loading: "थियेटर लोड हो रहे हैं...",
    empty: "चुने गए शहर के लिए कोई थियेटर उपलब्ध नहीं है",
    title: "उपलब्ध थियेटर",
    screens: "स्क्रीन",
  },
  Marathi: {
    loading: "थिएटर्स लोड होत आहेत...",
    empty: "निवडलेल्या शहरासाठी थिएटर्स उपलब्ध नाहीत",
    title: "उपलब्ध थिएटर्स",
    screens: "स्क्रीन",
  },
};

export default function AvailableTheatres() {
  const navigate = useNavigate();
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const { appLanguage } = useAppLanguage();
  const text = theatreText[appLanguage] || theatreText.English;

  useEffect(() => {
    const fetchTheatres = async () => {
      try {
        const city = localStorage.getItem("selectedCity") || "Kolhapur";
        const res = await axios.get(`http://localhost:5000/api/theatres/get-theatre?city=${city}`);
        setTheatres(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTheatres();
  }, []);

  if (loading) return <p className="text-center mt-10">{text.loading}</p>;
  if (!theatres.length) return <p className="text-center mt-10">{text.empty}</p>;

  return (
    <div className="px-6 py-12 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-orange-600 mb-8">{text.title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {theatres.map((t) => (
          <div
            key={t._id}
            className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
            onClick={() => {
              localStorage.setItem("selectedTheatre", t._id);
              navigate(`/allmovies?theatre=${t._id}`);
            }}
          >
            <h3 className="text-lg font-bold mb-1">{t.name}</h3>
            <p className="text-gray-600 mb-1">{t.location}</p>
            <p className="text-gray-600 mb-1">{t.city}</p>
            <p className="text-gray-600 mb-2">
              {text.screens}: {t.screens}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
