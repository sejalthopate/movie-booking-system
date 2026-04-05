import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Calendar, MapPin } from "lucide-react";
import { useAppLanguage } from "../../i18n/useAppLanguage";

const personText = {
  English: {
    loading: "Loading...",
    unknown: "Unknown",
    na: "N/A",
    back: "Back",
    alsoKnownAs: "Also Known As",
    role: "Role",
    bio: "Bio",
    peers: "Peers & More...",
    family: "Family",
  },
  Hindi: {
    loading: "लोड हो रहा है...",
    unknown: "अज्ञात",
    na: "उपलब्ध नहीं",
    back: "वापस",
    alsoKnownAs: "इन्हें भी जाना जाता है",
    role: "भूमिका",
    bio: "जीवनी",
    peers: "साथी और अन्य",
    family: "परिवार",
  },
  Marathi: {
    loading: "लोड होत आहे...",
    unknown: "अज्ञात",
    na: "उपलब्ध नाही",
    back: "मागे",
    alsoKnownAs: "यांना असेही ओळखले जाते",
    role: "भूमिका",
    bio: "चरित्र",
    peers: "सहकारी आणि इतर",
    family: "कुटुंब",
  },
};

export default function PersonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const { appLanguage } = useAppLanguage();
  const text = personText[appLanguage] || personText.English;

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/persons/get-persons-by-id/${id}`);
        setPerson(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPerson();
  }, [id]);

  if (!person) return <p className="p-6">{text.loading}</p>;

  const renderPersonCard = (item) => (
    <div
      key={item._id}
      onClick={() => navigate(`/persondetail/${item._id}`)}
      className="flex flex-col items-center w-24 text-center cursor-pointer hover:scale-105 transition"
    >
      <img
        src={item.photo || "/fallback-profile.png"}
        alt={item.name || text.unknown}
        className="w-20 h-20 object-cover rounded-full mb-1"
      />
      <p className="text-sm font-medium">{item.name || text.na}</p>
      <p className="text-xs text-gray-500">{item.role || ""}</p>
    </div>
  );

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 bg-red-500 text-white rounded">
        {text.back}
      </button>

      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0 flex flex-col items-center">
            <img src={person.photo || "/fallback-profile.png"} alt={person.name} className="w-48 h-48 object-cover rounded-lg" />

            {(person.dob || person.birthInfo) && (
              <div className="mt-2 flex flex-col gap-1 border-t border-gray-300 pt-2 w-full items-center">
                {person.dob && (
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Calendar size={16} />
                    <span>{new Date(person.dob).toLocaleDateString()}</span>
                  </div>
                )}
                {person.birthInfo && (
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <MapPin size={16} />
                    <span>{person.birthInfo}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <h2 className="text-3xl font-bold">{person.name}</h2>
            {person.aka && <p className="text-gray-500 italic">{text.alsoKnownAs}: {person.aka}</p>}
            <p><b>{text.role}:</b> {person.role || text.na}</p>
            {person.bio && <p><b>{text.bio}:</b> {person.bio}</p>}
          </div>
        </div>

        {person.peers?.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-2">{text.peers}</h3>
            <div className="flex flex-wrap gap-4">
              {person.peers.map((item) => renderPersonCard(item))}
            </div>
          </div>
        )}

        {person.family?.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-2">{text.family}</h3>
            <div className="flex flex-wrap gap-4">
              {person.family.map((familyItem) =>
                familyItem.member ? (
                  <div
                    key={familyItem.member._id}
                    className="flex flex-col items-center w-24 text-center cursor-pointer hover:scale-105 transition"
                    onClick={() => navigate(`/persondetail/${familyItem.member._id}`)}
                  >
                    <img
                      src={familyItem.member.photo || "/fallback-profile.png"}
                      alt={familyItem.member.name || text.unknown}
                      className="w-20 h-20 object-cover rounded-full mb-1"
                    />
                    <p className="text-sm font-medium">{familyItem.member.name || text.na}</p>
                    <p className="text-xs text-gray-500">{familyItem.member.role || ""}</p>
                    {familyItem.relation && <p className="text-xs text-gray-400">{familyItem.relation}</p>}
                  </div>
                ) : null
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
