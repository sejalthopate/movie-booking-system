import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  addMovieApi,
  getMoviesApi,
  updateMovieApi,
  deleteMovieApi,
} from "../../Services/MovieApi";

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [allPersons, setAllPersons] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    poster: "",
    trailers: [{ language: "", url: "" }],
    genre: "",
    duration: "",
    releaseDate: "",
    endDate: "",
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
        trailers: form.trailers.filter((t) => t.language && t.url),
        cast: form.cast
          .filter((c) => c.person)
          .map((c) => ({ person: c.person, character: c.character })),
        crew: form.crew.filter((c) => c),
        peers: form.peers.filter((p) => p),
        family: form.family.filter((f) => f),
      };

      if (editId) {
        await updateMovieApi(editId, payload);
      } else {
        await addMovieApi(payload);
      }

      setForm({
        title: "",
        poster: "",
        trailers: [{ language: "", url: "" }],
        genre: "",
        duration: "",
        releaseDate: "",
        endDate: "",
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

  // Handle Edit
  const handleEdit = (movie) => {
    setEditId(movie._id);
    setShowForm(true);
    setForm({
      title: movie.title || "",
      poster: movie.poster || "",
      trailers: movie.trailers?.length ? movie.trailers : [{ language: "", url: "" }],
      genre: movie.genre || "",
      duration: movie.duration || "",
      releaseDate: movie.releaseDate?.slice(0, 10) || "",
      endDate: movie.endDate?.slice(0, 10) || "",
      cast:
        movie.cast?.map((c) => ({
          person: c.person?._id || "",
          character: c.character || "",
        })) || [],
      crew: movie.crew?.map((c) => c?._id || "") || [],
      peers: movie.peers?.map((p) => p?._id || "") || [],
      family: movie.family?.map((f) => f?._id || "") || [],
    });
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this movie?")) return;
    await deleteMovieApi(id);
    fetchMovies();
  };

  // Status Logic
  const getMovieStatus = (releaseDate) => {
    const today = new Date();
    if (!releaseDate) return "upcoming";
    const release = new Date(releaseDate);
    if (release > today) return "upcoming";
    const diffDays = (today - release) / (1000 * 60 * 60 * 24);
    if (diffDays <= 30) return "new";
    return "ended";
  };

  const statusColor = (status) => {
    if (status === "new") return "bg-green-500";
    if (status === "ended") return "bg-red-500";
    return "bg-yellow-500";
  };

  // Multi-select handler
  const handleMultiSelect = (e, field) => {
    const options = Array.from(e.target.selectedOptions).map((o) => o.value);
    setForm({ ...form, [field]: options });
  };

  // Add / Remove Cast
  const addCastMember = () =>
    setForm({ ...form, cast: [...form.cast, { person: "", character: "" }] });
  const removeCastMember = (idx) => {
    const newCast = [...form.cast];
    newCast.splice(idx, 1);
    setForm({ ...form, cast: newCast });
  };

  return (
    <div className="space-y-6 md:space-y-8 w-full px-4 md:px-0 overflow-x-hidden">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 md:p-10 rounded-3xl shadow-xl">
        <h2 className="text-2xl md:text-4xl font-bold">🎬 Manage Movies</h2>
        <p className="text-white/90 text-sm md:text-base mt-1">
          Add, edit and manage all movies in your database.
        </p>
      </div>

      <button
        onClick={() => {
          setShowForm(true);
          setEditId(null);
        }}
        className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
      >
        ➕ Add New Movie
      </button>

      {/* FORM SECTION */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-3xl p-4 md:p-8 shadow-2xl mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Movie Title</label>
              <input
                placeholder="e.g. Inception"
                className="border rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-400 outline-none"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Poster Image URL</label>
              <input
                placeholder="https://image-link.com"
                className="border rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-400 outline-none"
                value={form.poster}
                onChange={(e) => setForm({ ...form, poster: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Genre</label>
              <input
                placeholder="Action, Drama"
                className="border rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-400 outline-none"
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })}
              />
            </div>

            {/* Dates & Duration */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Duration (min)</label>
              <input
                placeholder="140"
                className="border rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-400 outline-none"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Release Date</label>
              <input
                type="date"
                className="border rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-400 outline-none w-full"
                value={form.releaseDate}
                onChange={(e) => setForm({ ...form, releaseDate: e.target.value })}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">End Date</label>
              <input
                type="date"
                className="border rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-400 outline-none w-full"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                required
              />
            </div>
          </div>

          {/* 🎬 Trailers Section */}
          <div className="mt-8">
            <label className="font-bold text-lg block mb-3 border-b pb-1">Trailers</label>
            {form.trailers.map((t, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-3 mb-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <input
                  placeholder="Language (Marathi/Hindi)"
                  value={t.language}
                  onChange={(e) => {
                    const updated = [...form.trailers];
                    updated[index].language = e.target.value;
                    setForm({ ...form, trailers: updated });
                  }}
                  className="border p-3 rounded-xl flex-1 text-sm bg-white"
                />
                <input
                  placeholder="Video URL"
                  value={t.url}
                  onChange={(e) => {
                    const updated = [...form.trailers];
                    updated[index].url = e.target.value;
                    setForm({ ...form, trailers: updated });
                  }}
                  className="border p-3 rounded-xl flex-[2] text-sm bg-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...form.trailers];
                    updated.splice(index, 1);
                    setForm({ ...form, trailers: updated });
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setForm({ ...form, trailers: [...form.trailers, { language: "", url: "" }] })
              }
              className="text-red-500 font-semibold text-sm hover:underline"
            >
              + Add Trailer URL
            </button>
          </div>

          {/* Cast Section */}
          <div className="mt-8">
            <label className="font-bold text-lg block mb-3 border-b pb-1">Cast Members</label>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {form.cast.map((c, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <select
                    value={c.person}
                    onChange={(e) => {
                      const newCast = [...form.cast];
                      newCast[idx].person = e.target.value;
                      setForm({ ...form, cast: newCast });
                    }}
                    className="border p-2 rounded-xl flex-1 text-sm bg-white"
                  >
                    <option value="">Select Actor</option>
                    {allPersons.filter((p) => p.role === "Actor").map((p) => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                  <input
                    placeholder="Character Name"
                    value={c.character}
                    onChange={(e) => {
                      const newCast = [...form.cast];
                      newCast[idx].character = e.target.value;
                      setForm({ ...form, cast: newCast });
                    }}
                    className="border p-2 rounded-xl flex-1 text-sm bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeCastMember(idx)}
                    className="text-red-500 p-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addCastMember}
              className="mt-3 text-red-500 font-semibold text-sm hover:underline"
            >
              + Add Cast Member
            </button>
          </div>

          {/* Multi-Select Group */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="flex flex-col">
              <label className="font-semibold text-sm mb-2">Crew (Producer/Director)</label>
              <select
                multiple
                value={form.crew}
                onChange={(e) => handleMultiSelect(e, "crew")}
                className="border p-2 rounded-2xl h-40 text-sm focus:ring-2 focus:ring-red-400"
              >
                {allPersons.filter((p) => p.role !== "Actor").map((p) => (
                  <option key={p._id} value={p._id}>{p.name} ({p.role})</option>
                ))}
              </select>
              <p className="text-[10px] text-gray-400 mt-1">Hold Ctrl/Cmd to select multiple</p>
            </div>
            <div className="flex flex-col">
              <label className="font-semibold text-sm mb-2">Peers</label>
              <select
                multiple
                value={form.peers}
                onChange={(e) => handleMultiSelect(e, "peers")}
                className="border p-2 rounded-2xl h-40 text-sm focus:ring-2 focus:ring-red-400"
              >
                {allPersons.map((p) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="font-semibold text-sm mb-2">Family</label>
              <select
                multiple
                value={form.family}
                onChange={(e) => handleMultiSelect(e, "family")}
                className="border p-2 rounded-2xl h-40 text-sm focus:ring-2 focus:ring-red-400"
              >
                {allPersons.map((p) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-10 border-t pt-6">
            <button
              type="submit"
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-10 py-3 rounded-2xl shadow-lg font-bold hover:scale-105 transition"
            >
              {editId ? "Update Movie" : "Save Movie"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-100 text-gray-600 px-10 py-3 rounded-2xl shadow-sm font-bold hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* MOVIES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.map((m) => {
          const status = getMovieStatus(m.releaseDate);
          return (
            <div
              key={m._id}
              className="group bg-white border border-gray-100 rounded-[2rem] shadow-md overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              {/* Image Container with Aspect Ratio */}
              <div className="relative aspect-[2/3] md:aspect-square w-full overflow-hidden">
                <img
                  src={m.poster}
                  alt={m.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                  <span className={`w-2 h-2 rounded-full ${statusColor(status)}`}></span>
                  <span className="capitalize text-[10px] text-white font-bold tracking-wider">{status}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-1">{m.title}</h3>
                  <div className="space-y-1.5 text-xs text-gray-500">
                    <p><span className="font-semibold text-gray-700">Genre:</span> {m.genre || "N/A"}</p>
                    <p><span className="font-semibold text-gray-700">Release:</span> {m.releaseDate ? new Date(m.releaseDate).toLocaleDateString() : "N/A"}</p>
                    <p><span className="font-semibold text-gray-700">Ends:</span> {m.endDate ? new Date(m.endDate).toLocaleDateString() : "N/A"}</p>
                    
                    <div className="pt-3 mt-3 border-t border-gray-50 space-y-1">
                       <p className="line-clamp-2"><span className="font-semibold text-gray-700">Cast:</span> {m.cast?.map(c => c.person?.name).filter(Boolean).join(", ") || "N/A"}</p>
                       <p className="line-clamp-1"><span className="font-semibold text-gray-700">Director:</span> {m.crew?.find(c => c.role === "Director")?.name || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {m.trailers?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {m.trailers.map((t, i) => (
                        <a
                          key={i}
                          href={t.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-bold text-red-500 border border-red-200 px-2 py-1 rounded-lg hover:bg-red-50 transition"
                        >
                          ▶ {t.language}
                        </a>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => handleEdit(m)} 
                      className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl text-xs font-bold hover:bg-gray-200 transition"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(m._id)} 
                      className="flex-1 bg-red-50 text-red-600 py-2 rounded-xl text-xs font-bold hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminMovies;