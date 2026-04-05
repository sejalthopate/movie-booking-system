import React, { useEffect, useState } from "react";
import {
  getCoupons,
  createCoupon,
  deleteCoupon,
  updateCoupon,
} from "../../Services/TACouponApi";
import axios from "axios";

const ThreatreAdminOffers = () => {
  const theatreId = "THEATRE_001"; // demo theatre
  const [coupons, setCoupons] = useState([]);
  const [movies, setMovies] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    code: "",
    movieId: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    validFrom: "",
    validTill: "",
    usageLimit: "",
  });

  /* FETCH MOVIES */
  const fetchMovies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/movies/get-movie");
      setMovies(res.data || []);
    } catch (err) {
      console.error("Error fetching movies:", err);
      setMovies([]);
    }
  };

  /* FETCH COUPONS (movie-wise) */
  const fetchCoupons = async () => {
    if (!form.movieId) return;
    try {
      const res = await getCoupons(theatreId, form.movieId);
      setCoupons(res.data || []);
    } catch (err) {
      console.error("Error fetching coupons:", err);
      setCoupons([]);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [form.movieId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.code || !form.discountValue || !form.movieId) {
      return alert("Please fill required fields");
    }

    const payload = {
      ...form,
      theatreId,
      discountValue: Number(form.discountValue),
      usageLimit: Number(form.usageLimit),
      validFrom: form.validFrom ? new Date(form.validFrom) : null,
      validTill: form.validTill ? new Date(form.validTill) : null,
    };

    try {
      if (editingId) {
        await updateCoupon(editingId, payload);
        setEditingId(null);
      } else {
        await createCoupon(payload);
      }

      setForm({
        code: "",
        movieId: form.movieId,
        discountType: "PERCENTAGE",
        discountValue: "",
        validFrom: "",
        validTill: "",
        usageLimit: "",
      });

      fetchCoupons();
    } catch (err) {
      console.error("Error saving coupon:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error saving coupon");
    }
  };

  const handleEdit = (c) => {
    setEditingId(c._id);
    setForm({
      code: c.code,
      movieId: c.movieId,
      discountType: c.discountType,
      discountValue: c.discountValue,
      validFrom: c.validFrom?.slice(0, 10) || "",
      validTill: c.validTill?.slice(0, 10) || "",
      usageLimit: c.usageLimit || "",
    });
  };

  const removeCoupon = async (id) => {
    if (window.confirm("Delete this coupon?")) {
      try {
        await deleteCoupon(id);
        fetchCoupons();
      } catch (err) {
        console.error("Error deleting coupon:", err.response?.data || err.message);
        alert(err.response?.data?.message || "Error deleting coupon");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Title */}
      <h2 className="text-2xl font-bold text-red-600 mb-6">
        🎁 Offers & Coupons (Movie Wise)
      </h2>

      {/* Add/Edit Coupon */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">
          {editingId ? "✏️ Edit Coupon" : "➕ Add New Coupon"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            name="movieId"
            value={form.movieId}
            onChange={handleChange}
            className="border rounded-lg p-3 focus:ring-2 focus:ring-pink-500 outline-none"
          >
            <option value="">Select Movie</option>
            {movies?.map((m) => (
              <option key={m._id} value={m._id}>
                {m.title}
              </option>
            ))}
          </select>

          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            placeholder="Coupon Code"
            className="border rounded-lg p-3 focus:ring-2 focus:ring-pink-500 outline-none"
          />

          <select
            name="discountType"
            value={form.discountType}
            onChange={handleChange}
            className="border rounded-lg p-3 focus:ring-2 focus:ring-pink-500 outline-none"
          >
            <option value="PERCENTAGE">Percentage</option>
            <option value="FLAT">Flat</option>
          </select>

          <input
            name="discountValue"
            value={form.discountValue}
            onChange={handleChange}
            placeholder="Discount Value"
            className="border rounded-lg p-3 focus:ring-2 focus:ring-pink-500 outline-none"
          />

          <input
            type="date"
            name="validFrom"
            value={form.validFrom}
            onChange={handleChange}
            className="border rounded-lg p-3 focus:ring-2 focus:ring-pink-500 outline-none"
          />

          <input
            type="date"
            name="validTill"
            value={form.validTill}
            onChange={handleChange}
            className="border rounded-lg p-3 focus:ring-2 focus:ring-pink-500 outline-none"
          />

          <input
            name="usageLimit"
            value={form.usageLimit}
            onChange={handleChange}
            placeholder="Usage Limit"
            className="border rounded-lg p-3 focus:ring-2 focus:ring-pink-500 outline-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="mt-5 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
        >
          {editingId ? "Update Coupon" : "Add Coupon"}
        </button>
      </div>

      {/* Coupons Table */}
      {form.movieId && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            📋 Coupons for Selected Movie
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-xl overflow-hidden text-center">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 text-left">Movie</th>
                  <th className="p-3 text-left">Code</th>
                  <th className="p-3 text-center">Discount</th>
                  <th className="p-3 text-center">Validity</th>
                  <th className="p-3 text-center">Used</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {coupons.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-400">
                      No coupons for this movie
                    </td>
                  </tr>
                )}

                {coupons.map((c, idx) => {
                  const movie = movies.find((m) => m._id === c.movieId);
                  return (
                    <tr
                      key={c._id}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-red-50"}
                    >
                      <td className="p-3 font-medium">{movie?.title || "N/A"}</td>
                      <td className="p-3 font-semibold text-red-600">{c.code}</td>
                      <td className="p-3 text-center">
                        {c.discountType === "PERCENTAGE"
                          ? `${c.discountValue}%`
                          : `₹${c.discountValue}`}
                      </td>
                      <td className="p-3 text-center">
                        {c.validFrom?.slice(0, 10)} - {c.validTill?.slice(0, 10)}
                      </td>
                      <td className="p-3 text-center">
                        {c.usedCount || 0}/{c.usageLimit || 0}
                      </td>
                      <td className="p-3 text-center flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(c)}
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-xl font-semibold hover:scale-105 transition"
                        >
                           Edit
                        </button>
                        <button
                          onClick={() => removeCoupon(c._id)}
                          className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl font-semibold hover:scale-105 transition"
                        >
                           Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreatreAdminOffers;
