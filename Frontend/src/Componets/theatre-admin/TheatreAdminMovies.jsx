import React, { useEffect, useState } from "react";
import {
  addMovieApi,
  getMoviesApi,
  updateMovieApi,
  deleteMovieApi,
} from "../../Services/MovieApi";
import axios from "axios";

const TheatreAdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [allPersons, setAllPersons] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    poster: "",
    trailer: "",
    language: "",
    genre: "",
    duration: "",
    releaseDate: "",
    endDate: "",
   timeSlots: [],
    cast: [],
    crew: [],
    peers: [],
    family: [],
  });

  // Fetch Movies
  const fetchMovies = async () => {
    try {
      const res = await getMoviesApi();
      setMovies(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch all persons
  const fetchPersons = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/persons/get-persons");
      setAllPersons(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchPersons();
  }, []);

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        cast: form.cast
          .filter((c) => c.person)
          .map((c) => ({ person: c.person, character: c.character })),
        crew: form.crew.filter((c) => c),
        peers: form.peers.filter((p) => p),
        family: form.family.filter((f) => f),
       timeSlots: form.timeSlots,
      };

      if (editId) {
        await updateMovieApi(editId, payload);
      } else {
        await addMovieApi(payload);
      }

      setForm({
        title: "",
        poster: "",
        trailer: "",
        language: "",
        genre: "",
        duration: "",
        releaseDate: "",
        endDate: "",
        timeSlots: form.timeSlots,
        cast: [],
        crew: [],
        peers: [],
        family: [],
      });
      setEditId(null);
      setShowForm(false);
      fetchMovies();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (movie) => {
    setEditId(movie._id);
    setShowForm(true);
    setForm({
      title: movie.title || "",
      poster: movie.poster || "",
      trailer: movie.trailer || "",
      language: movie.language || "",
      genre: movie.genre || "",
      duration: movie.duration || "",
      releaseDate: movie.releaseDate?.slice(0, 10) || "",
      endDate: movie.endDate?.slice(0, 10) || "",
      timeSlots: movie.timeSlots || [],
      cast: movie.cast?.map((c) => ({
        person: c.person?._id || "",      
        character: c.character || "",
      })) || [],
      crew: movie.crew?.map((c) => c?._id || "") || [],
      peers: movie.peers?.map((p) => p?._id || "") || [],
      family: movie.family?.map((f) => f?._id || "") || [],
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this movie?")) return;
    await deleteMovieApi(id);
    fetchMovies();
  };

  const handleMultiSelect = (e, field) => {
    const options = Array.from(e.target.selectedOptions).map((o) => o.value);
    setForm({ ...form, [field]: options });
  };

  const addCastMember = () =>
    setForm({ ...form, cast: [...form.cast, { person: "", character: "" }] });
  const removeCastMember = (idx) => {
    const newCast = [...form.cast];
    newCast.splice(idx, 1);
    setForm({ ...form, cast: newCast });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-red-600">🎬 Admin – Manage Movies</h1>

      <button
        onClick={() => {
          setShowForm(true);
          setEditId(null);
        }}
        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-5 py-2 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 mb-6"
      >
        ➕ {editId ? "Edit Movie" : "Add Movie"}
      </button>

      {/* FORM */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-4 gap-3 bg-white p-5 rounded-2xl shadow-lg mb-6"
        >
          <input
            placeholder="Title"
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            placeholder="Poster URL"
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            value={form.poster}
            onChange={(e) => setForm({ ...form, poster: e.target.value })}
            required
          />
          <input
            placeholder="Trailer URL"
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            value={form.trailer}
            onChange={(e) => setForm({ ...form, trailer: e.target.value })}
          />
          <input
            placeholder="Language"
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            value={form.language}
            onChange={(e) => setForm({ ...form, language: e.target.value })}
          />
          <input
            placeholder="Genre"
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            value={form.genre}
            onChange={(e) => setForm({ ...form, genre: e.target.value })}
          />
          <input
            placeholder="Duration"
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
          />
          <input
            type="date"
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            value={form.releaseDate}
            onChange={(e) => setForm({ ...form, releaseDate: e.target.value })}
            required
          />
          <input
            type="date"
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            required
          />

          <div className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500">
  {["10:00 AM", "1:30 PM", "6:00 PM", "9:30 PM"].map((slot) => (
    <label key={slot} className="flex items-center gap-2">
      <input
        type="checkbox"
        value={slot}
        checked={form.timeSlots.includes(slot)}
        onChange={(e) => {
          if (e.target.checked) {
            setForm({ ...form, timeSlots: [...form.timeSlots, slot] });
          } else {
            setForm({
              ...form,
              timeSlots: form.timeSlots.filter((s) => s !== slot),
            });
          }
        }}
      />
      {slot}
    </label>
  ))}
</div>

          {/* Cast */}
          <div className="col-span-4">
            <label className="font-semibold mb-1 block">Cast</label>
            {form.cast.map((c, idx) => (
              <div key={idx} className="flex gap-2 items-center mb-2">
                <select
                  value={c.person}
                  onChange={(e) => {
                    const newCast = [...form.cast];
                    newCast[idx].person = e.target.value;
                    setForm({ ...form, cast: newCast });
                  }}
                  className="border p-2 rounded flex-1"
                >
                  <option value="">Select Actor</option>
                  {allPersons
                    .filter((p) => p.role === "Actor")
                    .map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                </select>
                <input
                  placeholder="Character"
                  value={c.character}
                  onChange={(e) => {
                    const newCast = [...form.cast];
                    newCast[idx].character = e.target.value;
                    setForm({ ...form, cast: newCast });
                  }}
                  className="border p-2 rounded flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeCastMember(idx)}
                  className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addCastMember}
              className="bg-blue-500 text-white px-4 py-1 rounded-full hover:bg-blue-600 transition"
            >
              + Add Cast
            </button>
          </div>

          {/* Crew, Peers, Family same multi-select styles */}
          <div className="col-span-4">
            <label className="font-semibold mb-1 block">Crew</label>
            <select
              multiple
              value={form.crew}
              onChange={(e) => handleMultiSelect(e, "crew")}
              className="border p-2 rounded w-full h-32"
            >
              {allPersons
                .filter((p) => p.role !== "Actor")
                .map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.role})
                  </option>
                ))}
            </select>
          </div>

          <div className="col-span-4">
            <label className="font-semibold mb-1 block">Peers</label>
            <select
              multiple
              value={form.peers}
              onChange={(e) => handleMultiSelect(e, "peers")}
              className="border p-2 rounded w-full h-32"
            >
              {allPersons.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-4">
            <label className="font-semibold mb-1 block">Family</label>
            <select
              multiple
              value={form.family}
              onChange={(e) => handleMultiSelect(e, "family")}
              className="border p-2 rounded w-full h-32"
            >
              {allPersons.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 col-span-4">
            <button
              className="bg-green-600 text-white px-5 py-2 rounded-full font-semibold shadow-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-300"
            >
              {editId ? "Update" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-400 text-white px-5 py-2 rounded-full font-semibold hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Movies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {movies.map((m) => (
          <div
            key={m._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
          >
            <div className="w-full h-48 overflow-hidden rounded-t-2xl">
              <img
                src={m.poster}
                alt={m.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-lg text-red-600 mb-1">{m.title}</h3>
                <div className="space-y-1 text-sm">
                  <p><b>Lang:</b> {m.language || "N/A"}</p>
                  <p><b>Genre:</b> {m.genre || "N/A"}</p>
                  <p><b>Dur:</b> {m.duration || "N/A"}</p>
                  <p><b>Release:</b> {m.releaseDate ? new Date(m.releaseDate).toLocaleDateString() : "N/A"}</p>
                  <p><b>End:</b> {m.endDate ? new Date(m.endDate).toLocaleDateString() : "N/A"}</p>
                  <p><b>Time Slot:</b> {m.timeSlots?.join(", ") || "N/A"}</p>
                  <p><b>Cast:</b> {m.cast?.map((c) => (c.person?.name || "") + ` (${c.character || ""})`).filter(Boolean).join(", ") || "N/A"}</p>
                  <p><b>Crew:</b> {m.crew?.map((c) => c?.name || "").filter(Boolean).join(", ") || "N/A"}</p>
                  <p><b>Peers:</b> {m.peers?.map((p) => p?.name).filter(Boolean).join(", ") || "N/A"}</p>
                  <p><b>Family:</b> {m.family?.map((f) => f?.name).filter(Boolean).join(", ") || "N/A"}</p>
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center">
                {m.trailer && (
                  <a
                    href={m.trailer}
                    target="_blank"
                    rel="noreferrer"
                    className="text-red-600 text-sm underline"
                  >
                    ▶ Trailer
                  </a>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(m)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition transform hover:scale-105"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(m._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 transition transform hover:scale-105"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TheatreAdminMovies;
