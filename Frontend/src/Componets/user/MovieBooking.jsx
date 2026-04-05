// import React, { useEffect, useState } from "react";
// import { useParams, useSearchParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { getTheatres } from "../../Services/TheatreApi";
// import { useAppLanguage } from "../../i18n/useAppLanguage";

// const bookingText = {
//   English: {
//     missingSelection: "Please select theatre, date and time",
//     back: "Back",
//     cancelBooking: "Cancel Booking",
//     title: "Book Your Show",
//     availableUntil: "Movie available until",
//     selectTheatre: "Select Theatre",
//     chooseTheatre: "Choose a theatre",
//     selectDate: "Select Date",
//     selectTime: "Select Time",
//     noTimeSlot: "No time slot available",
//     continueToSeats: "Continue to Seat Selection",
//   },
//   Hindi: {
//     missingSelection: "कृपया थियेटर, तारीख और समय चुनें",
//     back: "वापस",
//     cancelBooking: "बुकिंग रद्द करें",
//     title: "अपना शो बुक करें",
//     availableUntil: "फिल्म उपलब्ध है",
//     selectTheatre: "थियेटर चुनें",
//     chooseTheatre: "एक थियेटर चुनें",
//     selectDate: "तारीख चुनें",
//     selectTime: "समय चुनें",
//     noTimeSlot: "कोई टाइम स्लॉट उपलब्ध नहीं",
//     continueToSeats: "सीट चयन पर जाएं",
//   },
//   Marathi: {
//     missingSelection: "कृपया थिएटर, तारीख आणि वेळ निवडा",
//     back: "मागे",
//     cancelBooking: "बुकिंग रद्द करा",
//     title: "तुमचा शो बुक करा",
//     availableUntil: "चित्रपट उपलब्ध आहे",
//     selectTheatre: "थिएटर निवडा",
//     chooseTheatre: "एक थिएटर निवडा",
//     selectDate: "तारीख निवडा",
//     selectTime: "वेळ निवडा",
//     noTimeSlot: "टाइम स्लॉट उपलब्ध नाही",
//     continueToSeats: "सीट निवडीकडे जा",
//   },
// };

// export default function BookingPage() {
//   const { id: movieId } = useParams();
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const { appLanguage } = useAppLanguage();
//   const text = bookingText[appLanguage] || bookingText.English;

//   const preSelectedTheatre = searchParams.get("theatre");
//   const [theatres, setTheatres] = useState([]);
//   const [selectedTheatre, setSelectedTheatre] = useState(preSelectedTheatre || "");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [selectedTime, setSelectedTime] = useState("");
//  const [movieTimeSlots, setMovieTimeSlots] = useState([]);
//   const [movieEndDate, setMovieEndDate] = useState("");
//   const today = new Date().toISOString().split("T")[0];

//   useEffect(() => {
//     const fetchTheatres = async () => {
//       try {
//         const res = await getTheatres();
//         setTheatres(res.data);
//       } catch (err) {
//         console.error("Failed to load theatres", err);
//       }
//     };

//     fetchTheatres();
//   }, []);

//   useEffect(() => {
//     const fetchMovie = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/movies/get-movie");
//         const movie = res.data.find((item) => item._id === movieId);
//         if (movie) {
//          if (movie.timeSlots) setMovieTimeSlots(movie.timeSlots);
//           if (movie.endDate) setMovieEndDate(new Date(movie.endDate).toLocaleDateString());
//         }
//       } catch (err) {
//         console.error("Failed to load movie", err);
//       }
//     };

//     fetchMovie();
//   }, [movieId]);

//   const goToSeats = () => {
//     if (!selectedTheatre || !selectedDate || !selectedTime) {
//       alert(text.missingSelection);
//       return;
//     }

//     navigate(`/seatselection/${movieId}/seats?theatre=${selectedTheatre}&date=${selectedDate}&time=${selectedTime}`);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
//       <div className="w-full max-w-3xl">
//         <div className="flex justify-between mb-4">
//           <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg font-semibold">
//             {text.back}
//           </button>

//           <button onClick={() => navigate("/user")} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold">
//             {text.cancelBooking}
//           </button>
//         </div>

//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           <h2 className="text-3xl font-bold text-center mb-4 text-red-600">{text.title}</h2>

//           {movieEndDate && (
//             <p className="text-center mb-6 text-gray-700 font-semibold">
//               {text.availableUntil}: <span className="text-red-600">{movieEndDate}</span>
//             </p>
//           )}

//           <div className="mb-6">
//             <label className="block text-sm font-semibold mb-2">{text.selectTheatre}</label>
//             <select
//               value={selectedTheatre}
//               onChange={(e) => setSelectedTheatre(e.target.value)}
//               className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-red-400"
//             >
//               <option value="">{text.chooseTheatre}</option>
//               {theatres.map((theatre) => (
//                 <option key={theatre._id} value={theatre._id}>
//                   {theatre.theaterName || theatre.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="mb-6">
//             <label className="block text-sm font-semibold mb-2">{text.selectDate}</label>
//             <input
//               type="date"
//               value={selectedDate}
//               min={today}
//               onChange={(e) => setSelectedDate(e.target.value)}
//               className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-red-400"
//             />
//           </div>

//           <div className="mb-8">
//             <label className="block text-sm font-semibold mb-3">{text.selectTime}</label>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//               {movieTimeSlots.length > 0 ? (
//   movieTimeSlots.map((slot, index) => (
//     <button
//       key={index}
//       onClick={() => setSelectedTime(slot)}
//       className={`py-2 rounded-xl font-semibold transition ${
//         selectedTime === slot
//           ? "bg-green-600 text-white shadow"
//           : "bg-gray-100 hover:bg-gray-200"
//       }`}
//     >
//       {slot}
//     </button>
//   ))
// ) : (
//   <p className="text-gray-500">{text.noTimeSlot}</p>
// )}
//             </div>
//           </div>

//           <button
//             onClick={goToSeats}
//             className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-lg font-bold transition"
//           >
//             {text.continueToSeats}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getTheatres } from "../../Services/TheatreApi";
import { useAppLanguage } from "../../i18n/useAppLanguage";

const bookingText = {
  English: {
    missingSelection: "Please select theatre, date and time",
    back: "Back",
    cancelBooking: "Cancel Booking",
    title: "Book Your Show",
    availableUntil: "Movie available until",
    selectTheatre: "Select Theatre",
    chooseTheatre: "Choose a theatre",
    selectDate: "Select Date",
    selectTime: "Select Time",
    noTimeSlot: "No time slot available",
    continueToSeats: "Continue to Seat Selection",
  },
  Hindi: {
    missingSelection: "कृपया थियेटर, तारीख और समय चुनें",
    back: "वापस",
    cancelBooking: "बुकिंग रद्द करें",
    title: "अपना शो बुक करें",
    availableUntil: "फिल्म उपलब्ध है",
    selectTheatre: "थियेटर चुनें",
    chooseTheatre: "एक थियेटर चुनें",
    selectDate: "तारीख चुनें",
    selectTime: "समय चुनें",
    noTimeSlot: "कोई टाइम स्लॉट उपलब्ध नहीं",
    continueToSeats: "सीट चयन पर जाएं",
  },
  Marathi: {
    missingSelection: "कृपया थिएटर, तारीख आणि वेळ निवडा",
    back: "मागे",
    cancelBooking: "बुकिंग रद्द करा",
    title: "तुमचा शो बुक करा",
    availableUntil: "चित्रपट उपलब्ध आहे",
    selectTheatre: "थिएटर निवडा",
    chooseTheatre: "एक थिएटर निवडा",
    selectDate: "तारीख निवडा",
    selectTime: "वेळ निवडा",
    noTimeSlot: "टाइम स्लॉट उपलब्ध नाही",
    continueToSeats: "सीट निवडीकडे जा",
  },
};

export default function BookingPage() {
  const { id: movieId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { appLanguage } = useAppLanguage();
  const text = bookingText[appLanguage] || bookingText.English;

  const preSelectedTheatre = searchParams.get("theatre");
  const [theatres, setTheatres] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState(preSelectedTheatre || "");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [movieTimeSlots, setMovieTimeSlots] = useState([]);
  const [movieEndDate, setMovieEndDate] = useState("");
  const today = new Date().toISOString().split("T")[0];

  // ✅ NEW: current time + function
  const currentTime = new Date();

  const isPastTime = (slot) => {
    const [time, modifier] = slot.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }
    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    const slotDate = new Date();
    slotDate.setHours(hours, minutes, 0);

    return slotDate < currentTime;
  };

  useEffect(() => {
    const fetchTheatres = async () => {
      try {
        const res = await getTheatres();
        setTheatres(res.data);
      } catch (err) {
        console.error("Failed to load theatres", err);
      }
    };

    fetchTheatres();
  }, []);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/movies/get-movie");
        const movie = res.data.find((item) => item._id === movieId);
        if (movie) {
          if (movie.timeSlots) setMovieTimeSlots(movie.timeSlots);
          if (movie.endDate)
            setMovieEndDate(new Date(movie.endDate).toLocaleDateString());
        }
      } catch (err) {
        console.error("Failed to load movie", err);
      }
    };

    fetchMovie();
  }, [movieId]);

  const goToSeats = () => {
    if (!selectedTheatre || !selectedDate || !selectedTime) {
      alert(text.missingSelection);
      return;
    }

    navigate(
      `/seatselection/${movieId}/seats?theatre=${selectedTheatre}&date=${selectedDate}&time=${selectedTime}`
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-3xl">
        <div className="flex justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg font-semibold"
          >
            {text.back}
          </button>

          <button
            onClick={() => navigate("/user")}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold"
          >
            {text.cancelBooking}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-4 text-red-600">
            {text.title}
          </h2>

          {movieEndDate && (
            <p className="text-center mb-6 text-gray-700 font-semibold">
              {text.availableUntil}:{" "}
              <span className="text-red-600">{movieEndDate}</span>
            </p>
          )}

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              {text.selectTheatre}
            </label>
            <select
              value={selectedTheatre}
              onChange={(e) => setSelectedTheatre(e.target.value)}
              className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <option value="">{text.chooseTheatre}</option>
              {theatres.map((theatre) => (
                <option key={theatre._id} value={theatre._id}>
                  {theatre.theaterName || theatre.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              {text.selectDate}
            </label>
            <input
              type="date"
              value={selectedDate}
              min={today}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold mb-3">
              {text.selectTime}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {movieTimeSlots.length > 0 ? (
                movieTimeSlots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedTime(slot)}
                    disabled={selectedDate === today && isPastTime(slot)}
                    className={`py-2 rounded-xl font-semibold transition ${
                      selectedTime === slot
                        ? "bg-green-600 text-white shadow"
                        : "bg-gray-100 hover:bg-gray-200"
                    } ${
                      selectedDate === today && isPastTime(slot)
                        ? "bg-gray-300 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {slot}
                  </button>
                ))
              ) : (
                <p className="text-gray-500">{text.noTimeSlot}</p>
              )}
            </div>
          </div>

          <button
            onClick={goToSeats}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-lg font-bold transition"
          >
            {text.continueToSeats}
          </button>
        </div>
      </div>
    </div>
  );
}