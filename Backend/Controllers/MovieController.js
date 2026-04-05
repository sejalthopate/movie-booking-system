import Movie from "../Models/Movie.js";

// 🔁 Auto status logic
const getStatusByDate = (releaseDate) => {
  const today = new Date();
  const rDate = new Date(releaseDate);
  if (today < rDate) return "upcoming";
  return "new";
};

// ➕ Add Movie
export const addMovie = async (req, res) => {
  try {
    const status = getStatusByDate(req.body.releaseDate);

    const movie = await Movie.create({
      ...req.body,  // ← includes timeSlot from frontend
      status,
    });

    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📥 Get Movies
export const getMovies = async (req, res) => {
  try {
    const today = new Date();

    const movies = await Movie.find({
      $or: [
        { endDate: { $gte: today } },   // new movies (valid)
        { endDate: { $exists: false } } // old movies (no endDate)
      ],
    })
      .populate({ path: "cast.person", select: "name photo role" })
      .populate({ path: "crew", select: "name photo role" })
      .populate({ path: "peers", select: "name photo role" })
      .populate({ path: "family", select: "name photo role" })
      .sort({ createdAt: -1 });

    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update Movie
export const updateMovie = async (req, res) => {
  try {
    const status = getStatusByDate(req.body.releaseDate);

    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { ...req.body, status }, // ← includes timeSlot from frontend
      { new: true }
    )
      .populate({ path: "cast.person", select: "name photo role" })
      .populate({ path: "crew", select: "name photo role" })
      .populate({ path: "peers", select: "name photo role" })
      .populate({ path: "family", select: "name photo role" });

    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Delete Movie
export const deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
