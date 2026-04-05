import React, { useEffect, useState } from "react";
import { getTheatres, addTheatres, deleteTheatre } from "../../Services/TheatreApi";

function TheatreAdminTheaters() {
  const [theatres, setTheatres] = useState([]);
  const [form, setForm] = useState({
    location: "",
    city: "",
    screens: "",
  });

  const fetchTheatres = async () => {
    const res = await getTheatres();
    setTheatres(res.data);
  };

  useEffect(() => {
    fetchTheatres();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.location || !form.city || !form.screens) {
      alert("All fields required");
      return;
    }

    await addTheatres(form);

    setForm({ location: "", city: "", screens: "" });
    fetchTheatres();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this theatre?")) {
      await deleteTheatre(id);
      fetchTheatres();
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-red-600 mb-6">
        🎭 Theatre Management
      </h2>

      {/* Form */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="number"
            name="screens"
            placeholder="Screens"
            value={form.screens}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <button
            type="submit"
            className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white py-2 rounded-full font-semibold shadow-md hover:shadow-lg hover:shadow-red-300/50 transform hover:scale-105 transition-all duration-300"
          >
            Add Theatre
          </button>
        </form>
      </div>

      {/* Cards */}
      {theatres.length === 0 ? (
        <p className="text-center text-gray-500">No theatres added yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {theatres.map((t) => (
            <div
              key={t._id}
              className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <p className="text-gray-600 mb-2">📍 Location: {t.location}</p>
              <p className="text-gray-600 mb-2">🏙️ City: {t.city}</p>
              <p className="text-gray-600 mb-4">🎬 Screens: {t.screens}</p>

              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(t._id)}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white py-2 rounded-full font-semibold shadow-md hover:shadow-lg hover:shadow-red-300/50 transform hover:scale-105 transition-all duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TheatreAdminTheaters;
