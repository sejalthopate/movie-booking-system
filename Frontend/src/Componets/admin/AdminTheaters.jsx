import React, { useEffect, useState } from "react";
import { getTheatres, addTheatres, updateTheatre, deleteTheatre } from "../../Services/TheatreApi";

function TheatreManagement() {
  const [theatres, setTheatres] = useState([]);
  const [form, setForm] = useState({
    name: "", // Added
    location: "",
    city: "",
    screens: "",
  });
  const [editId, setEditId] = useState(null);

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

    if (!form.name || !form.location || !form.city || !form.screens) {
      alert("All fields required");
      return;
    }

    if (editId) {
      await updateTheatre(editId, form);
      setEditId(null);
    } else {
      await addTheatres(form);
    }

    setForm({ name: "", location: "", city: "", screens: "" });
    fetchTheatres();
  };

  const handleEdit = (theatre) => {
    setForm({
      name: theatre.name,
      location: theatre.location,
      city: theatre.city,
      screens: theatre.screens,
    });
    setEditId(theatre._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this theatre?")) {
      await deleteTheatre(id);
      fetchTheatres();
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-red-600 mb-6">表演 Theatre Management</h2>

      <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 mb-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Theatre Name"
            value={form.name}
            onChange={handleChange}
            className="p-3 rounded-xl border focus:ring-2 focus:ring-red-500 outline-none"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Theatre Location (Area)"
            value={form.location}
            onChange={handleChange}
            className="p-3 rounded-xl border focus:ring-2 focus:ring-red-500 outline-none"
            required
          />
          {/* Changed City to Select */}
          <select
            name="city"
            value={form.city}
            onChange={handleChange}
            className="p-3 rounded-xl border focus:ring-2 focus:ring-red-500 outline-none"
            required
          >
            <option value="">Select City</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Pune">Pune</option>
            <option value="Kolhapur">Kolhapur</option>
          </select>
          <input
            type="number"
            name="screens"
            placeholder="Screens"
            value={form.screens}
            onChange={handleChange}
            className="p-3 rounded-xl border focus:ring-2 focus:ring-red-500 outline-none"
            required
          />
          <button type="submit" className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-2xl font-semibold shadow-lg hover:scale-105 transition-all">
            {editId ? "Update Theatre" : "Add Theatre"}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {theatres.map((t) => (
          <div key={t._id} className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition-all">
            <h3 className="text-lg font-bold mb-1">{t.name}</h3>
            <p className="text-gray-600">📍 {t.location}, {t.city}</p>
            <p className="text-gray-600 mb-4">🎬 Screens: {t.screens}</p>
            <div className="flex gap-3">
              <button onClick={() => handleEdit(t)} className="flex-1 bg-blue-500 text-white py-2 rounded-xl">Edit</button>
              <button onClick={() => handleDelete(t._id)} className="flex-1 bg-red-500 text-white py-2 rounded-xl">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TheatreManagement;