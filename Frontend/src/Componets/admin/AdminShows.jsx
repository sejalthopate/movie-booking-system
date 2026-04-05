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
    movieName: "",
    theatreName: "",
    screenNumber: "",
    showDate: "",
    showTime: "",
    price: "",
  });
  const [editId, setEditId] = useState(null);

  // 1. Improved fetch to handle potential empty responses
  const fetchShows = async () => {
    try {
      const res = await getShows();
      setShows(res.data || []);
    } catch (error) {
      console.error("Error fetching shows:", error);
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (
      !form.movieName ||
      !form.theatreName ||
      !form.screenNumber ||
      !form.showDate ||
      !form.showTime ||
      !form.price
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editId) {
        await updateShow(editId, form);
        setEditId(null);
      } else {
        await addShow(form);
      }

      // Reset form after successful submission
      setForm({
        movieName: "",
        theatreName: "",
        screenNumber: "",
        showDate: "",
        showTime: "",
        price: "",
      });

      fetchShows();
    } catch (error) {
      console.error("Error saving show:", error);
      alert("Failed to save show. Check console for details.");
    }
  };

  // 2. Fixed handleEdit to prevent MongoDB internal fields (_id, __v) 
  // from being sent back to the server during update
  const handleEdit = (show) => {
    setEditId(show._id);
    setForm({
      movieName: show.movieName,
      theatreName: show.theatreName,
      screenNumber: show.screenNumber,
      showDate: show.showDate,
      showTime: show.showTime,
      price: show.price,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this show?")) {
      try {
        await deleteShow(id);
        fetchShows();
      } catch (error) {
        console.error("Error deleting show:", error);
      }
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen overflow-x-hidden">
      <h2 className="text-xl md:text-3xl font-bold text-red-600 mb-6 flex items-center gap-2">
        🎬 <span className="hidden sm:inline">Admin</span> Shows Management
      </h2>

      {/* Form Card */}
      <div className="bg-white p-5 md:p-8 rounded-3xl shadow-xl mb-10 border border-gray-100">
        <h3 className="text-lg md:text-xl font-semibold mb-6 text-gray-700 border-b pb-2">
          {editId ? "✏️ Update Show Details" : "➕ Add New Show"}
        </h3>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5"
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 ml-1">Movie Name</label>
            <input
              type="text"
              name="movieName"
              placeholder="Enter Movie Name"
              value={form.movieName}
              onChange={handleChange}
              className="p-3 rounded-xl border focus:ring-2 focus:ring-red-500 outline-none w-full text-sm md:text-base"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 ml-1">Theatre Name</label>
            <input
              type="text"
              name="theatreName"
              placeholder="Enter Theatre Name"
              value={form.theatreName}
              onChange={handleChange}
              className="p-3 rounded-xl border focus:ring-2 focus:ring-red-500 outline-none w-full text-sm md:text-base"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 ml-1">Screen Number</label>
            <input
              type="number"
              name="screenNumber"
              placeholder="e.g. 1"
              value={form.screenNumber}
              onChange={handleChange}
              className="p-3 rounded-xl border focus:ring-2 focus:ring-red-500 outline-none w-full text-sm md:text-base"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 ml-1">Show Date</label>
            <input
              type="date"
              name="showDate"
              value={form.showDate}
              onChange={handleChange}
              className="p-3 rounded-xl border focus:ring-2 focus:ring-red-500 outline-none w-full text-sm md:text-base"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 ml-1">Show Time</label>
            <input
              type="text"
              name="showTime"
              placeholder="e.g. 10:30 AM"
              value={form.showTime}
              onChange={handleChange}
              className="p-3 rounded-xl border focus:ring-2 focus:ring-red-500 outline-none w-full text-sm md:text-base"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 ml-1">Ticket Price</label>
            <input
              type="number"
              name="price"
              placeholder="e.g. 250"
              value={form.price}
              onChange={handleChange}
              className="p-3 rounded-xl border focus:ring-2 focus:ring-red-500 outline-none w-full text-sm md:text-base"
            />
          </div>

          <button
            type="submit"
            className="sm:col-span-2 md:col-span-3 bg-gradient-to-r from-red-500 to-pink-500 
                       text-white py-3 rounded-2xl font-semibold shadow-lg 
                       hover:shadow-xl active:scale-95 transition-all duration-300 mt-2"
          >
            {editId ? "Update Show" : "Add Show"}
          </button>
          
          {editId && (
            <button
              type="button"
              onClick={() => {setEditId(null); setForm({movieName:"", theatreName:"", screenNumber:"", showDate:"", showTime:"", price:""})}}
              className="sm:col-span-2 md:col-span-3 bg-gray-400 text-white py-2 rounded-2xl font-semibold"
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
              <tr>
                <th className="p-4 font-semibold">Movie</th>
                <th className="p-4 font-semibold">Theater</th>
                <th className="p-4 font-semibold">Screen</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Time</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {shows.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-10 text-gray-500 italic">
                    No shows found. Try adding a new one.
                  </td>
                </tr>
              ) : (
                shows.map((show) => (
                  <tr key={show._id} className="hover:bg-red-50/30 transition-colors">
                    <td className="p-4 font-medium text-gray-800">{show.movieName}</td>
                    <td className="p-4 text-gray-600">{show.theatreName}</td>
                    <td className="p-4 text-gray-600">{show.screenNumber}</td>
                    <td className="p-4 text-gray-600">{show.showDate}</td>
                    <td className="p-4 text-gray-600">{show.showTime}</td>
                    <td className="p-4 font-semibold text-gray-700">₹{show.price}</td>
                    <td className="p-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(show)}
                          className="bg-blue-500 text-white px-4 py-1.5 rounded-xl text-xs font-medium"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(show._id)}
                          className="bg-red-500 text-white px-4 py-1.5 rounded-xl text-xs font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminShows;