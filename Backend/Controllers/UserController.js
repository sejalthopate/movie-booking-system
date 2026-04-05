import { User } from "../Models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ================= REGISTER (USER ONLY) =================
export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "user",
      isBlocked: false
    });

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not registered" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "You are blocked by admin" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🎯 Theatre Admin temp password check
    const tempPasswordFlag = user.role === "theatreAdmin" ? user.isTempPassword || false : false;

    const token = jwt.sign(
      { id: user._id, role: user.role, theatreId: user.theatreId || null },
      "SECRET_KEY",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        theatreId: user.theatreId || null,
        isTempPassword: tempPasswordFlag, // 🎯 frontend ला flag
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= CREATE ADMIN (POSTMAN) =================
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      isBlocked: false
    });

    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= CREATE THEATRE ADMIN =================
export const createTheatreAdmin = async (req, res) => {
  try {
    const { name, email, password, phone, theatreId } = req.body;

    if (!name || !email || !password || !theatreId) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      phone: phone || "",
      password: hashedPassword,
      role: "theatreAdmin",
      theatreId,
      isBlocked: false,
      isTempPassword: true // 🎯 temp password flag
    });

    res.status(201).json({
      message: "Theatre Admin created successfully",
      loginEmail: email,
      tempPassword: password
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET THEATRE ADMINS =================
export const getTheatreAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "theatreAdmin" }).select("-password");
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= CHANGE THEATRE ADMIN PASSWORD =================
export const changeTheatreAdminPassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;

    if (!userId || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "theatreAdmin") {
      return res.status(404).json({ message: "Theatre Admin not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.isTempPassword = false; // 🎯 remove temp password flag after change
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
