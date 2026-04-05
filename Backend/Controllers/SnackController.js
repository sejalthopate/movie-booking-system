import Snack from "../Models/snackModel.js";

// ADD SNACK
export const addSnack = async (req, res) => {
  try {
    const snack = await Snack.create(req.body);
    res.status(201).json(snack);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL SNACKS
export const getSnacks = async (req, res) => {
  try {
    const snacks = await Snack.find().sort({ createdAt: -1 });
    res.status(200).json(snacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE SNACK
export const updateSnack = async (req, res) => {
  try {
    const updated = await Snack.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE SNACK
export const deleteSnack = async (req, res) => {
  try {
    await Snack.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Snack deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};