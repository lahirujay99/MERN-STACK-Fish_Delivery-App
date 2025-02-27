import express from "express";
import { protect, admin } from "../middleware/auth.js";
const router = express.Router();

// @route   GET /api/admin/dashboard
router.get("/dashboard", protect, admin, (req, res) => {
  res.json({ message: "Admin dashboard data" });
});

export default router;
