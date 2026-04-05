import React, { useEffect, useState } from "react";
import {
  getShows,
  addShow,
  updateShow,
  deleteShow,
} from "../../Services/ShowApi";

function AdminShows() {
  const [shows, setShows] = useState([]);
  const [form, setForm] = useState({
    showName: "",
    screenNumber: "",
    showDate: "",
    showTime: "",
    price: "",
  });
  const [editId, setEditId] = useState(null);

  const fetchShows = async () => {
    const res = await getShows();
    setShows(res.data);
  };

  useEffect(() => {
    fetchShows();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.showName ||
      !form.screenNumber ||
      !form.showDate ||
      !form.showTime ||
      !form.price
    ) {
      alert("All fields required");
      return;
    }

    if (editId) {
      await updateShow(editId, form);
      setEditId(null);
    } else {
      await addShow(form);
    }

    setForm({
      showName: "",
      screenNumber: "",
      showDate: "",
      showTime: "",
      price: "",
    });

    fetchShows();
  };

  const handleEdit = (show) => {
    setForm({
      showName: show.showName,
      screenNumber: show.screenNumber,
      showDate: show.showDate,
      showTime: show.showTime,
      price: show.price,
    });
    setEditId(show._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this show?")) {
      await deleteShow(id);
      fetchShows();
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-red-600 mb-6">
        🎬 Admin Shows Management
      </h2>

      {/* Form */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <input
            type="text"
            name="showName"
            placeholder="Show Name"
            value={form.showName}
            onChange={handleChange}
            className="input"
          />

          <input
            type="number"
            name="screenNumber"
            placeholder="Screen No"
            value={form.screenNumber}
            onChange={handleChange}
            className="input"
          />

          <input
            type="date"
            name="showDate"
            value={form.showDate}
            onChange={handleChange}
            className="input"
          />

          <input
            type="text"
            name="showTime"
            placeholder="Show Time (10:30 AM)"
            value={form.showTime}
            onChange={handleChange}
            className="input"
          />

          <input
            type="number"
            name="price"
            placeholder="Ticket Price"
            value={form.price}
            onChange={handleChange}
            className="input"
          />

          <button
            type="submit"
            className="md:col-span-3 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            {editId ? "Update Show" : "Add Show"}
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
        <table className="w-full text-sm">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="p-3">Show</th>
              <th>Screen</th>
              <th>Date</th>
              <th>Time</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shows.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No shows available
                </td>
              </tr>
            ) : (
              shows.map((show) => (
                <tr key={show._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{show.showName}</td>
                  <td>{show.screenNumber}</td>
                  <td>{show.showDate}</td>
                  <td>{show.showTime}</td>
                  <td>₹{show.price}</td>
                  <td className="flex gap-2 p-3">
                    <button
                      onClick={() => handleEdit(show)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(show._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminShows;
