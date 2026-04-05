import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      return alert("Please fill all fields");
    }

    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      setLoading(true);
      const res = await axios.put(
        "http://localhost:5000/api/users/theatre-admin/change-password",
        {
          userId: user._id,
          newPassword
        },
        {
          headers: { Authorization: token }
        }
      );

      alert(res.data.message || "Password changed successfully");

      // Update local user data
      const updatedUser = { ...user, isTempPassword: false };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Redirect to theatre-admin dashboard
      navigate("/theatre-admin");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error changing password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Change Password</h2>

        <p className="text-sm text-gray-600 mb-4 text-center">
          You are logging in with a temporary password. Please set a new password.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="New Password"
            className="border p-3 rounded-lg w-full"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="border p-3 rounded-lg w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            {loading ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
