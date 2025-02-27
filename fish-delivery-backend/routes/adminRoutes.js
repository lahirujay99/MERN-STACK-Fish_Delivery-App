// routes/adminRoutes.js
import express from "express";
import { protect, admin } from "../middleware/auth.js";
const router = express.Router();

// @desc    Get admin dashboard
// @route   GET /api/admin/dashboard
// @route   Protected/Admin
router.get("/dashboard", protect, admin, (req, res) => {
  res.json({ message: "Admin dashboard data" }); // Replace with actual data
});

export default router;
