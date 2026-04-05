import Person from "../Models/PersonModel.js";

// ➕ Admin: Add Actor / Producer
export const addPersonController = async (req, res) => {
  try {
    const person = await Person.create(req.body); // aka & birthInfo optional, automatically included if present
    res.status(201).json(person);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📥 Get all persons (Admin dropdown साठी)
export const getAllPersonsController = async (req, res) => {
  try {
    const persons = await Person.find();
    res.json(persons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👤 Single person profile (User side)
export const getPersonByIdController = async (req, res) => {
  try {
    const person = await Person.findById(req.params.id)
      .populate({
        path: "peers",
        select: "name role photo aka birthInfo" // Include new fields
      })
      .populate({
        path: "family.member",
        select: "name role photo aka birthInfo" // Include new fields
      });

    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }

    res.json(person);
  } catch (error) {
    res.status(404).json({ message: "Person not found" });
  }
};

// ✏️ UPDATE Person (peers / family / basic info)
export const updatePersonController = async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);

    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }

    // Update basic fields if provided
    const { name, role, character, photo, bio, dob, aka, birthInfo, peers, family } = req.body;

    if (name) person.name = name;
    if (role) person.role = role;
    if (character) person.character = character;
    if (photo) person.photo = photo;
    if (bio) person.bio = bio;
    if (dob) person.dob = dob;
    if (aka) person.aka = aka;
    if (birthInfo) person.birthInfo = birthInfo;
    if (peers) person.peers = peers;
    if (family) person.family = family;

    await person.save();

    const populatedPerson = await Person.findById(person._id)
      .populate({
        path: "peers",
        select: "name role photo aka birthInfo"
      })
      .populate({
        path: "family.member",
        select: "name role photo aka birthInfo"
      });

    res.json(populatedPerson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🗑️ DELETE Person
export const deletePersonController = async (req, res) => {
  try {
    const { id } = req.params;

    const person = await Person.findByIdAndDelete(id);

    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }

    res.status(200).json({ message: "Person deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
