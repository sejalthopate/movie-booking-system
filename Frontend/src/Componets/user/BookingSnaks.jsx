import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSnacks } from "../../Services/SnaksApi";
import { useAppLanguage } from "../../i18n/useAppLanguage";

const snackText = {
  English: {
    noData: "No booking data found",
    loading: "Loading snacks...",
    title: "Grab a Bite!",
    noSnacks: "No snacks found",
    remove: "Remove",
    add: "Add",
    seats: "Seats",
    snacks: "Snacks",
    total: "Total",
    proceed: "Proceed",
    categories: [
      { value: "All", label: "All" },
      { value: "Popcorn", label: "Popcorn" },
      { value: "Snacks", label: "Snacks" },
      { value: "Beverages", label: "Beverages" },
      { value: "Combos", label: "Combos" },
    ],
    diets: [
      { value: "All", label: "All" },
      { value: "Veg", label: "Veg" },
      { value: "Non-Veg", label: "Non-Veg" },
    ],
  },
  Hindi: {
    noData: "कोई बुकिंग डेटा नहीं मिला",
    loading: "स्नैक्स लोड हो रहे हैं...",
    title: "कुछ खा लें!",
    noSnacks: "कोई स्नैक्स नहीं मिला",
    remove: "हटाएं",
    add: "जोड़ें",
    seats: "सीटें",
    snacks: "स्नैक्स",
    total: "कुल",
    proceed: "आगे बढ़ें",
    categories: [
      { value: "All", label: "सभी" },
      { value: "Popcorn", label: "पॉपकॉर्न" },
      { value: "Snacks", label: "स्नैक्स" },
      { value: "Beverages", label: "पेय" },
      { value: "Combos", label: "कॉम्बो" },
    ],
    diets: [
      { value: "All", label: "सभी" },
      { value: "Veg", label: "शाकाहारी" },
      { value: "Non-Veg", label: "मांसाहारी" },
    ],
  },
  Marathi: {
    noData: "बुकिंग डेटा मिळाला नाही",
    loading: "स्नॅक्स लोड होत आहेत...",
    title: "काही खाऊया!",
    noSnacks: "स्नॅक्स मिळाले नाहीत",
    remove: "काढा",
    add: "जोडा",
    seats: "सीट्स",
    snacks: "स्नॅक्स",
    total: "एकूण",
    proceed: "पुढे जा",
    categories: [
      { value: "All", label: "सर्व" },
      { value: "Popcorn", label: "पॉपकॉर्न" },
      { value: "Snacks", label: "स्नॅक्स" },
      { value: "Beverages", label: "पेय" },
      { value: "Combos", label: "कॉम्बो" },
    ],
    diets: [
      { value: "All", label: "सर्व" },
      { value: "Veg", label: "व्हेज" },
      { value: "Non-Veg", label: "नॉन-व्हेज" },
    ],
  },
};

export default function BookingSnacks() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { appLanguage } = useAppLanguage();
  const text = snackText[appLanguage] || snackText.English;
  const bookingState = state || {};
  const { movieId, theatreId, screenId, date, time, seats = [] } = bookingState;
  const seatPrice = 150;

  const [snacks, setSnacks] = useState([]);
  const [filteredSnacks, setFilteredSnacks] = useState([]);
  const [selectedSnacks, setSelectedSnacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [diet, setDiet] = useState("All");

  const totalSeatsPrice = seats.length * seatPrice;

  useEffect(() => {
    const fetchSnacks = async () => {
      try {
        const res = await getSnacks();
        const availableSnacks = res.data.filter((snack) => snack.available);
        setSnacks(availableSnacks);
      } catch (err) {
        console.error("Failed to fetch snacks", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSnacks();
  }, []);

  useEffect(() => {
    let temp = [...snacks];

    if (category !== "All") {
      temp = temp.filter((snack) =>
        category === "Combos"
          ? snack.category.toLowerCase() === "combo"
          : snack.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (diet !== "All") {
      temp = temp.filter((snack) => (diet === "Veg" ? snack.isVeg : !snack.isVeg));
    }

    setFilteredSnacks(temp);
  }, [category, diet, snacks]);

  const toggleSnack = (snack) => {
    setSelectedSnacks((prev) => {
      const exists = prev.find((item) => item.snackId === snack._id);
      if (exists) return prev.filter((item) => item.snackId !== snack._id);
      return [...prev, { snackId: snack._id, name: snack.name, price: snack.price, qty: 1 }];
    });
  };

  const changeQty = (snackId, qty) => {
    if (qty <= 0) {
      setSelectedSnacks((prev) => prev.filter((item) => item.snackId !== snackId));
      return;
    }

    setSelectedSnacks((prev) =>
      prev.map((item) => (item.snackId === snackId ? { ...item, qty } : item))
    );
  };

  const snacksTotal = selectedSnacks.reduce((acc, snack) => acc + snack.price * snack.qty, 0);

  const handleConfirm = () => {
    navigate("/booking/confirm", {
      state: {
        movieId,
        theatreId,
        screenId,
        date,
        time,
        seats,
        snacks: selectedSnacks,
      },
    });
  };

  if (!state) return <h2 className="text-center mt-10">{text.noData}</h2>;

  if (loading) return <p className="text-center mt-10 font-bold">{text.loading}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-red-600 mb-6 text-center">{text.title}</h2>

      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        {text.diets.map((item) => (
          <button
            key={item.value}
            className={`px-3 py-1 rounded-full font-medium transition ${
              diet === item.value ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setDiet(item.value)}
          >
            {item.label}
          </button>
        ))}

        {text.categories.map((item) => (
          <button
            key={item.value}
            className={`px-4 py-2 rounded-full font-medium transition ${
              category === item.value ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setCategory(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl mb-6">
        {filteredSnacks.length === 0 ? (
          <p className="text-gray-600 text-center col-span-full">{text.noSnacks}</p>
        ) : (
          filteredSnacks.map((snack) => {
            const selected = selectedSnacks.find((item) => item.snackId === snack._id);
            return (
              <div key={snack._id} className="bg-white rounded-xl shadow p-4 flex items-center justify-between gap-4">
                <img
                  src={snack.image || "https://via.placeholder.com/80"}
                  alt={snack.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{snack.name}</h3>
                  {snack.description && <p className="text-gray-500 text-sm">{snack.description}</p>}
                  <p className="text-red-600 font-bold">Rs.{snack.price}</p>
                </div>
                <div className="flex flex-col items-center">
                  {selected ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => changeQty(snack._id, selected.qty - 1)} className="px-2 py-1 bg-gray-300 rounded">
                        -
                      </button>
                      <span>{selected.qty}</span>
                      <button onClick={() => changeQty(snack._id, selected.qty + 1)} className="px-2 py-1 bg-gray-300 rounded">
                        +
                      </button>
                      <button onClick={() => toggleSnack(snack)} className="ml-2 px-2 py-1 bg-red-600 text-white rounded">
                        {text.remove}
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => toggleSnack(snack)} className="px-4 py-2 bg-red-600 text-white rounded-xl font-semibold">
                      {text.add}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="w-full max-w-3xl flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-xl font-bold space-y-1">
          <div>{text.seats} ({seats.length}): Rs.{totalSeatsPrice}</div>
          <div>{text.snacks}: Rs.{snacksTotal}</div>
          <div className="text-red-600">{text.total}: Rs.{totalSeatsPrice + snacksTotal}</div>
        </div>
        <button onClick={handleConfirm} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition">
          {text.proceed}
        </button>
      </div>
    </div>
  );
}
