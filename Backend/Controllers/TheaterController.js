import Theatre from "../Models/TheaterModel.js";

// Get all theatres
// Get all theatres (with optional city filter)
export const getTheatres = async (req, res) => {
  try {
    const { city } = req.query; // Capture city from URL query
    const query = city ? { city: city } : {}; // If city exists, filter by it
    const theatres = await Theatre.find(query);
    res.status(200).json(theatres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add theatre
export const addTheatre = async (req, res) => {
  try {
    const { name, location, city, screens } = req.body;

    if (!name || !location || !city || !screens) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const theatre = new Theatre({ name, location, city, screens });
    await theatre.save();

    res.status(201).json(theatre);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update theatre
export const updateTheatre = async (req, res) => {
  try {
    const { name, location, city, screens } = req.body;
    const updatedTheatre = await Theatre.findByIdAndUpdate(
      req.params.id,
      { name, location, city, screens },
      { new: true }
    );
    if (!updatedTheatre) return res.status(404).json({ message: "Theatre not found" });
    res.status(200).json(updatedTheatre);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete theatre
export const deleteTheatre = async (req, res) => {
  try {
    const theatre = await Theatre.findByIdAndDelete(req.params.id);
    if (!theatre) return res.status(404).json({ message: "Theatre not found" });
    res.status(200).json({ message: "Theatre deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};