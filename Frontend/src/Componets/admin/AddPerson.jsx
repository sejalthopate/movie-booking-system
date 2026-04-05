// AdminPersons.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminPersonForm from "./AdminPersonForm";

export default function AdminPersons() {
  const [persons, setPersons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  // 📥 Fetch all persons
  const fetchPersons = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/persons/get-persons");
      setPersons(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPersons();
  }, []);

  // ➕ Form submit callback
  const handleSave = () => {
    setShowForm(false);
    setEditId(null);
    fetchPersons();
  };

  // ✏️ Edit person
  const handleEdit = (id) => {
    setEditId(id);
    setShowForm(true);
  };

  // ❌ Delete person
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this person?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/persons/delete-person/${id}`);
      fetchPersons();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🎭 Admin – Manage Persons</h1>

      <button
        onClick={() => { setShowForm(true); setEditId(null); }}
        className="bg-red-500 text-white px-4 py-2 rounded mb-4"
      >
        ➕ Add Person
      </button>

      {/* Form */}
      {showForm && (
        <AdminPersonForm
          personId={editId}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Persons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {persons.map((p) => (
          <div key={p._id} className="bg-white rounded shadow p-4 flex flex-col">
            <img src={p.photo} alt={p.name} className="w-full h-48 object-cover rounded mb-2" />
            <h3 className="font-semibold text-lg">{p.name}</h3>
            <p className="text-sm text-gray-600">{p.role}</p>
            {p.character && <p className="text-sm text-gray-600">Character: {p.character}</p>}

            {/* Actions */}
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleEdit(p._id)}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
