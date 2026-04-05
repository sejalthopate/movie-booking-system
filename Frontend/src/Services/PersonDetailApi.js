// personController.js
import Person from "../Models/Person.js";

export const getPerson = async (req, res) => {
  try {
    const person = await Person.findById(req.params.id)
      .populate("peers")   // populate peers
      .populate("family.member"); // populate family
    res.status(200).json(person);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
