import Show from "../Models/ShowModel.js";

// Add a new show
export const addShow = async (req, res) => {
  try {
    const { movieName, theatreName, screenNumber, showDate, showTime, price } = req.body;

    // Strict validation
    if (!movieName || !theatreName || !screenNumber || !showDate || !showTime || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newShow = new Show({
      movieName,
      theatreName,
      screenNumber,
      showDate,
      showTime,
      price,
    });

    const savedShow = await newShow.save();
    res.status(201).json(savedShow);
  } catch (error) {
    console.error("Add Show Error:", error);
    res.status(500).json({ message: "Server error while adding show" });
  }
};

// Get all shows (Sorted by newest first)
export const getShows = async (req, res) => {
  try {
    // .lean() converts Mongoose documents to plain JSON objects
    const shows = await Show.find().sort({ createdAt: -1 }).lean();
    res.status(200).json(shows);
  } catch (error) {
    console.error("Get Shows Error:", error);
    res.status(500).json({ message: "Server error while fetching shows" });
  }
};

// Update an existing show
export const updateShow = async (req, res) => {
  try {
    const { id } = req.params;
    
    // We filter the body to ensure internal MongoDB fields aren't updated
    const updatedData = { ...req.body };
    delete updatedData._id; 
    delete updatedData.__v;

    const updatedShow = await Show.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!updatedShow) {
      return res.status(404).json({ message: "Show not found" });
    }

    res.status(200).json(updatedShow);
  } catch (error) {
    console.error("Update Show Error:", error);
    res.status(500).json({ message: "Server error while updating show" });
  }
};

// Delete a show
export const deleteShow = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedShow = await Show.findByIdAndDelete(id);

    if (!deletedShow) {
      return res.status(404).json({ message: "Show not found" });
    }

    res.status(200).json({ message: "Show deleted successfully" });
  } catch (error) {
    console.error("Delete Show Error:", error);
    res.status(500).json({ message: "Server error while deleting show" });
  }
};