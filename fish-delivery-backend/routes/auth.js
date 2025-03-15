import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js"; 
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing

const router = express.Router();

// @route   POST /api/auth/register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });
    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid user data" });
  }
});

// @route   POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Not authorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", protect, async (req, res) => {
  const { username, email, password } = req.body; // Extract fields to update

  try {
    const user = await User.findById(req.user._id); // Get the logged-in user

    if (!user) {
      return res.status(404).json({ message: "User not found" }); // not happen due to protect middleware
    }

    // Update fields if provided
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) { // Only update password if a new one is provided
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt); // Hash the new password
    }

    const updatedUser = await user.save(); // Save updated user

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role, // Include role if needed in profile
      message: "Profile updated successfully",
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: "Validation error", errors: error.errors });
    }
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
});

// @route   DELETE /api/auth/profile
// @desc    Delete user account
// @access  Private
router.delete("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id); // Find the user to delete

    if (!user) {
      return res.status(404).json({ message: "User not found" }); // Again, should not happen with protect
    }

    await User.findByIdAndDelete(req.user._id); // Delete the user

    res.json({ message: "Account deleted successfully" }); // Success message
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ message: "Error deleting account", error: error.message });
  }
});


const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export default router;
