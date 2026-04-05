// AdminPersonForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminPersonForm({ personId, onSave, onCancel }) {
  const [allPersons, setAllPersons] = useState([]);
  const [form, setForm] = useState({
    name: "",
    aka: "", // Also Known As
    role: "Actor",
    character: "",
    photo: "",
    bio: "",
    dob: "",
    birthInfo: "", // e.g., "1898, Delhi, India"
    peers: [],
    family: [],
  });

  // Fetch all persons for Peers / Family dropdown
  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/persons/get-persons");
        setAllPersons(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPersons();
  }, []);

  // Fetch person for edit
  useEffect(() => {
    if (!personId) return;
    const fetchPerson = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/persons/get-persons-by-id/${personId}`);
        const p = res.data;
        setForm({
          name: p.name || "",
          aka: p.aka || "", // Also Known As
          role: p.role || "Actor",
          character: p.character || "",
          photo: p.photo || "",
          bio: p.bio || "",
          dob: p.dob ? p.dob.slice(0, 10) : "",
          birthInfo: p.birthInfo || "", // Birth info
          peers: p.peers?.map(peer => peer._id) || [],
          family: p.family?.map(f => ({ member: f.member?._id || "", relation: f.relation })) || [],
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchPerson();
  }, [personId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (personId) {
        await axios.put(`http://localhost:5000/api/persons/update-person/${personId}`, form);
      } else {
        await axios.post("http://localhost:5000/api/persons/add-person", form);
      }
      onSave();
    } catch (err) {
      console.error(err);
    }
  };

  const addFamilyMember = () => setForm({ ...form, family: [...form.family, { member: "", relation: "" }] });
  const removeFamilyMember = (idx) => {
    const newFam = [...form.family];
    newFam.splice(idx, 1);
    setForm({ ...form, family: newFam });
  };

  return (
    <div className="p-6 bg-white dark:bg-white-800 rounded shadow-md max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">{personId ? "Edit Person" : "Add Person"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Name & AKA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
            className="border p-2 rounded w-full"
          />
          <input
            placeholder="Also Known As (optional)"
            value={form.aka}
            onChange={e => setForm({ ...form, aka: e.target.value })}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Role */}
        <select
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
          className="border p-2 rounded w-full"
        >
          <option value="Actor">Actor</option>
          <option value="Producer">Producer</option>
          <option value="Director">Director</option>
        </select>

        {/* Character */}
        {form.role === "Actor" && (
          <input
            placeholder="Character"
            value={form.character}
            onChange={e => setForm({ ...form, character: e.target.value })}
            className="border p-2 rounded w-full"
          />
        )}

        {/* Photo & Bio */}
        <input
          placeholder="Photo URL"
          value={form.photo}
          onChange={e => setForm({ ...form, photo: e.target.value })}
          required
          className="border p-2 rounded w-full"
        />
        <textarea
          placeholder="Bio"
          value={form.bio}
          onChange={e => setForm({ ...form, bio: e.target.value })}
          className="border p-2 rounded w-full"
        />

        {/* DOB & Birth Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="date"
            value={form.dob}
            onChange={e => setForm({ ...form, dob: e.target.value })}
            className="border p-2 rounded w-full"
          />
          <input
            placeholder="Birth Info (e.g., 1898, Delhi, India)"
            value={form.birthInfo}
            onChange={e => setForm({ ...form, birthInfo: e.target.value })}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Peers */}
        <div>
          <label className="font-semibold mb-1 block">Peers</label>
          <select
            multiple
            value={form.peers}
            onChange={e => {
              const options = Array.from(e.target.selectedOptions).map(o => o.value);
              setForm({ ...form, peers: options });
            }}
            className="border p-2 rounded w-full h-32"
          >
            {allPersons.filter(p => p._id !== personId).map(p => (
              <option key={p._id} value={p._id}>{p.name} ({p.role})</option>
            ))}
          </select>
        </div>

        {/* Family */}
        <div>
          <label className="font-semibold mb-1 block">Family</label>
          {form.family.map((f, idx) => (
            <div key={idx} className="flex gap-2 items-center mb-2">
              <select
                value={f.member}
                onChange={e => {
                  const newFam = [...form.family];
                  newFam[idx].member = e.target.value;
                  setForm({ ...form, family: newFam });
                }}
                className="border p-2 rounded flex-1"
              >
                <option value="">Select Person</option>
                {allPersons.filter(p => p._id !== personId).map(p => (
                  <option key={p._id} value={p._id}>{p.name} ({p.role})</option>
                ))}
              </select>
              <input
                placeholder="Relation"
                value={f.relation}
                onChange={e => {
                  const newFam = [...form.family];
                  newFam[idx].relation = e.target.value;
                  setForm({ ...form, family: newFam });
                }}
                className="border p-2 rounded flex-1"
              />
              <button
                type="button"
                onClick={() => removeFamilyMember(idx)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addFamilyMember}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            + Add Family Member
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            {personId ? "Update" : "Save"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-white-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
