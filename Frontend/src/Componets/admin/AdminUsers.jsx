import React, { useEffect, useState } from "react";
import {
  getAdminUsers,
  toggleBlockUser,
} from "../../Services/AdminUsersApi";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  // 📥 Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await getAdminUsers();
      setUsers(res.data);
    } catch (error) {
      console.error("Fetch users error:", error);
    }
  };

  // 🚫 Block / Unblock
  const handleToggleBlock = async (id) => {
    try {
      await toggleBlockUser(id);
      fetchUsers(); // refresh list
    } catch (error) {
      console.error("Block/unblock error:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        👥 Users List
      </h2>

    {users.length === 0 ? (
  <p className="text-gray-500 text-center">No users found.</p>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {users.map((u) => (
      <div
        key={u._id}
        className="bg-white shadow rounded-2xl p-4 hover:shadow-xl transition flex flex-col justify-between"
      >
        <div>
          <h3 className="text-lg font-semibold mb-1">{u.name}</h3>
          <p className="text-gray-600 mb-1">📧 {u.email}</p>
          <p className="text-gray-600 mb-1">📱 {u.phone || "-"}</p>
          <p className="text-gray-500 mb-2 text-sm">🗓 {new Date(u.createdAt).toLocaleDateString("en-IN")}</p>
          <p className={`font-medium ${u.isBlocked ? "text-red-600" : "text-green-600"}`}>
            {u.isBlocked ? "❌ Blocked" : "✅ Active"}
          </p>
        </div>
        <button
          onClick={() => handleToggleBlock(u._id)}
          className={`mt-3 py-2 px-4 rounded-lg text-white font-semibold transition ${u.isBlocked ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
        >
          {u.isBlocked ? "Unblock" : "Block"}
        </button>
      </div>
    ))}
  </div>
)}
    </div>
  );
}
