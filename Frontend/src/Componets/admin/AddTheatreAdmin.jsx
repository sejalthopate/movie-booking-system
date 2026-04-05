import React, { useEffect, useState } from "react";
import { getTheatres } from "../../Services/TheatreApi";
import axios from "axios";

export default function AddTheatreAdmin() {
  const [theatres, setTheatres] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    theatreId: "",
  });
  const [result, setResult] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch theatres
  useEffect(() => {
    const fetchTheatres = async () => {
      try {
        const res = await getTheatres();
        const theatreArray = Array.isArray(res.data) ? res.data : res.data.data || [];
        setTheatres(theatreArray);
      } catch (err) {
        console.error("Error fetching theatres:", err);
      }
    };
    fetchTheatres();
  }, []);

  // Fetch theatre admins
  const fetchAdmins = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/users/get-theatre-admins",
        { headers: { Authorization: token } }
      );

      const adminsWithTheatre = res.data.map((a) => ({
        ...a,
        theatreName: theatres.find((t) => t._id === a.theatreId)?.name || "-",
        isTempPassword: a.isTempPassword || false,
      }));

      setAdmins(adminsWithTheatre);
    } catch (err) {
      console.error("Error fetching admins:", err);
      setAdmins([]);
    }
  };

  // Fetch admins when token or theatres change
  useEffect(() => {
    if (token && theatres.length > 0) fetchAdmins();
  }, [token, theatres]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.theatreId) {
      return alert("Please fill all required fields");
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/create-theatre-admin",
        form,
        { headers: { Authorization: token } }
      );

      setResult(res.data);

      // Clear form
      setForm({ name: "", email: "", password: "", phone: "", theatreId: "" });

      // Refresh admin list
      fetchAdmins();

      // Scroll to success message
      setTimeout(() => {
        document.getElementById("successMessage")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating admin");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setForm({ name: "", email: "", password: "", phone: "", theatreId: "" });
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10">
      {/* Create Button */}
      {!showForm && (
        <button
          className="bg-gradient-to-r from-red-500 to-pink-500
           text-white px-6 py-3 rounded-2xl shadow-lg font-bold
           hover:shadow-xl active:scale-95 transition duration-300 w-full mb-8"
          onClick={() => setShowForm(true)}
        >
          ➕ Create New Theatre Admin
        </button>
      )}

      {/* Form Card */}
      {showForm && (
        <div className="bg-white border border-gray-100 rounded-3xl p-5 md:p-8 shadow-2xl mb-10 transition-all">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">Create Theatre Admin</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 ml-1">Full Name</label>
              <input
                name="name"
                placeholder="Admin Name"
                className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-red-500 outline-none transition-all"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 ml-1">Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="admin@example.com"
                className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-red-500 outline-none transition-all"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 ml-1">Temporary Password</label>
              <input
                name="password"
                type="text"
                placeholder="Temp Password"
                className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-red-500 outline-none transition-all"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 ml-1">Phone Number</label>
              <input
                name="phone"
                placeholder="Phone (Optional)"
                className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-red-500 outline-none transition-all"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-gray-500 ml-1">Assign Theatre</label>
              <select
                name="theatreId"
                className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-red-500 outline-none transition-all"
                value={form.theatreId}
                onChange={handleChange}
              >
                <option value="">Select a Theatre</option>
                {theatres.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-3 mt-8">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 
                       hover:from-red-700 hover:to-pink-700
                       text-white py-3 rounded-2xl font-bold
                       shadow-md active:scale-95 transition duration-300"
            >
              Save Admin Account
            </button>

            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-100 hover:bg-gray-200
                       text-gray-700 py-3 rounded-2xl font-bold
                       active:scale-95 transition duration-300"
            >
              Cancel
            </button>
          </div>

          {/* Success Result */}
          {result && (
            <div id="successMessage" className="bg-green-50 border border-green-200 p-4 rounded-2xl mt-6">
              <p className="text-green-700 font-bold mb-2 flex items-center gap-2">
                <span>✅</span> Theatre Admin Created Successfully
              </p>
              <div className="text-sm space-y-1 text-green-800">
                <p><b>Email:</b> {result.loginEmail}</p>
                <p><b>Temporary Password:</b> {result.tempPassword}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Theatre Admin List Card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-5 md:p-8 shadow-xl">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          📋 Theatre Admin List
        </h2>
        
        {admins.length === 0 ? (
          <div className="text-center py-10 text-gray-400 italic">
            No administrators found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 text-gray-600 uppercase text-[11px] tracking-wider">
                  <th className="p-4 text-left border-b font-bold">Admin Name</th>
                  <th className="p-4 text-left border-b font-bold">Email</th>
                  <th className="p-4 text-left border-b font-bold">Phone</th>
                  <th className="p-4 text-left border-b font-bold">Assigned Theatre</th>
                  <th className="p-4 text-left border-b font-bold">Password Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {admins.map((a) => (
                  <tr key={a._id} className="hover:bg-red-50/30 transition-colors">
                    <td className="p-4 text-gray-800 font-medium">{a.name}</td>
                    <td className="p-4 text-gray-600">{a.email}</td>
                    <td className="p-4 text-gray-600">{a.phone || "-"}</td>
                    <td className="p-4">
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                        {a.theatreName}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        a.isTempPassword 
                        ? "bg-amber-100 text-amber-600" 
                        : "bg-green-100 text-green-600"
                      }`}>
                        {a.isTempPassword ? "Temporary" : "Verified"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-center text-gray-400 text-xs mt-6">
        Scroll horizontally to view full admin details on mobile.
      </p>
    </div>
  );
}