import React, { useEffect, useState } from "react";
import {
  getSnacks,
  addSnack,
  updateSnack,
  deleteSnack,
} from "../../Services/SnaksApi";

const AdminSnacks = () => {
  const [snacks, setSnacks] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    available: true,
  });
  const [editId, setEditId] = useState(null);

  const fetchSnacks = async () => {
    const res = await getSnacks();
    setSnacks(res.data);
  };

  useEffect(() => {
    fetchSnacks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await updateSnack(editId, form);
    } else {
      await addSnack(form);
    }
    setForm({ name: "", price: "", category: "", image: "", available: true });
    setEditId(null);
    fetchSnacks();
  };

  const handleEdit = (snack) => {
    setEditId(snack._id);
    setForm(snack);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this snack?")) {
      await deleteSnack(id);
      fetchSnacks();
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2">
        🍿 Manage Snacks
      </h1>

      {/* FORM CARD */}
      <div className="bg-white p-5 md:p-8 rounded-3xl shadow-xl border border-gray-100 mb-10">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          {editId ? "✏️ Edit Snack" : "➕ Add New Snack"}
        </h3>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          <div className="flex flex-col gap-1">
            <input
              placeholder="Snack Name"
              className="p-3 rounded-xl border focus:ring-2 focus:ring-red-500 outline-none text-sm w-full"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <input
              type="number"
              placeholder="Price (₹)"
              className="p-3 rounded-xl border focus:ring-2 focus:ring-red-500 outline-none text-sm w-full"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <input
              placeholder="Category (e.g. Popcorn)"
              className="p-3 rounded-xl border focus:ring-2 focus:ring-red-500 outline-none text-sm w-full"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <input
              placeholder="Image URL"
              className="p-3 rounded-xl border focus:ring-2 focus:ring-red-500 outline-none text-sm w-full"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-2xl font-semibold hover:shadow-lg active:scale-95 transition-all text-sm h-full"
          >
            {editId ? "Update Snack" : "Add Snack"}
          </button>
        </form>
      </div>

      {/* SNACKS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {snacks.map((snack) => (
          <div
            key={snack._id}
            className="bg-white p-4 rounded-[2rem] shadow-md hover:shadow-2xl transition-all duration-300 group border border-gray-50 flex flex-col"
          >
            <div className="relative h-44 w-full mb-4 overflow-hidden rounded-2xl">
              <img
                src={snack.image || "https://via.placeholder.com/200"}
                alt={snack.name}
                className="h-full w-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                <p className="text-xs font-bold text-gray-800">₹ {snack.price}</p>
              </div>
            </div>

            <div className="flex-1">
              <h2 className="font-bold text-lg text-gray-800 line-clamp-1">{snack.name}</h2>
              <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-4">
                {snack.category || "General"}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleEdit(snack)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 rounded-xl font-bold text-xs hover:shadow-lg active:scale-95 transition-all"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(snack._id)}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2.5 rounded-xl font-bold text-xs hover:shadow-lg active:scale-95 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {snacks.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <p className="text-gray-400">No snacks found. Add some to get started!</p>
        </div>
      )}
    </div>
  );
};

export default AdminSnacks;