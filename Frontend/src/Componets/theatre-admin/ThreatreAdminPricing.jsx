import React, { useEffect, useState } from "react";
import axios from "axios";

const ThreatreAdminPricing = () => {
  const [movies, setMovies] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    movieName: "",
    screen: "",
    classicPrice: "",
    primePrice: "",
  });

  const screens = ["Screen 1"];

  /* FETCH MOVIES */
  const fetchMovies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/movies/get-movie");
      setMovies(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* FETCH PRICING */
  const fetchTickets = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tickets");
      setTickets(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchTickets();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* SAVE PRICING */
  const handleSubmit = async () => {
    if (!form.movieName || !form.classicPrice || !form.primePrice)
      return alert("Fill required fields");

    const classicPayload = {
      movieName: form.movieName,
      screen: form.screen,
      seatType: "Classic",
      price: Number(form.classicPrice),
    };

    const primePayload = {
      movieName: form.movieName,
      screen: form.screen,
      seatType: "Prime",
      price: Number(form.primePrice),
    };

    await axios.post("http://localhost:5000/api/tickets", classicPayload);
    await axios.post("http://localhost:5000/api/tickets", primePayload);

    setForm({
      movieName: "",
      screen: "",
      classicPrice: "",
      primePrice: "",
    });

    fetchTickets();
  };

  /* GROUP CLASSIC + PRIME */
  const grouped = {};
  tickets.forEach((t) => {
    const key = t.movieName + t.screen;
    if (!grouped[key]) {
      grouped[key] = {
        movieName: t.movieName,
        screen: t.screen,
        classicPrice: "",
        primePrice: "",
      };
    }
    if (t.seatType === "Classic") grouped[key].classicPrice = t.price;
    if (t.seatType === "Prime") grouped[key].primePrice = t.price;
  });
  const rows = Object.values(grouped);

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">

      {/* TITLE */}
      <h2 className="text-2xl md:text-3xl font-bold text-red-600 mb-6">
        🎟 Ticket Pricing
      </h2>

      {/* ADD PRICING CARD */}
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-8">

        <h3 className="text-lg md:text-xl font-semibold mb-4">
          Add Ticket Pricing
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

          {/* MOVIE */}
          <select
            name="movieName"
            value={form.movieName}
            onChange={handleChange}
            className="border rounded-lg p-3 focus:ring-2 focus:ring-pink-500 outline-none w-full"
          >
            <option value="">Select Movie</option>
            {movies.map((m) => (
              <option key={m._id} value={m.title}>
                {m.title}
              </option>
            ))}
          </select>

          {/* SCREEN */}
          <select
            name="screen"
            value={form.screen}
            onChange={handleChange}
            className="border rounded-lg p-3 focus:ring-2 focus:ring-pink-500 outline-none w-full"
          >
            <option value="">Select Screen</option>
            {screens.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <input
            name="classicPrice"
            placeholder="Classic Price ₹"
            value={form.classicPrice}
            onChange={handleChange}
            className="border rounded-lg p-3 focus:ring-2 focus:ring-pink-500 outline-none w-full"
          />

          <input
            name="primePrice"
            placeholder="Prime Price ₹"
            value={form.primePrice}
            onChange={handleChange}
            className="border rounded-lg p-3 focus:ring-2 focus:ring-pink-500 outline-none w-full"
          />

        </div>

        <button
          onClick={handleSubmit}
          className="mt-5 w-full md:w-auto bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
        >
          Save Pricing
        </button>

      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">

        <h3 className="text-lg md:text-xl font-semibold mb-4">
          📋 Ticket Pricing List
        </h3>

        <div className="overflow-x-auto">

          <table className="table-auto w-full min-w-[500px] border-collapse text-center text-sm md:text-base">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Movie</th>
                <th className="p-3">Screen</th>
                <th className="p-3">Classic Price</th>
                <th className="p-3">Prime Price</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>

              {rows.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-6 text-gray-400">
                    No pricing added
                  </td>
                </tr>
              )}

              {rows.map((r, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-red-50"}
                >
                  <td className="p-3 font-medium text-left">{r.movieName}</td>
                  <td className="p-3">{r.screen}</td>
                  <td className="p-3 font-semibold">₹{r.classicPrice}</td>
                  <td className="p-3 font-semibold">₹{r.primePrice}</td>
                  <td className="p-3 flex justify-center gap-2 flex-wrap">
                    <button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-2 rounded-xl font-semibold text-xs sm:text-sm hover:scale-105 transition">
                      Edit
                    </button>
                    <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-2 rounded-xl font-semibold text-xs sm:text-sm hover:scale-105 transition">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default ThreatreAdminPricing;