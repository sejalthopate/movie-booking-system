import { User } from "../Models/UserModel.js";
import mongoose from "mongoose";
// 🔹 Get all users (admin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Block / Unblock user
export const toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ STEP 1: ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    // ✅ STEP 2: Find user
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ STEP 3: Toggle block
    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      isBlocked: user.isBlocked,
      message: user.isBlocked
        ? "User Blocked"
        : "User Unblocked",
    });
  } catch (err) {
    console.error("Toggle block error:", err); // 🔥 THIS LOG IS IMPORTANT
    res.status(500).json({ message: err.message });
  }
};