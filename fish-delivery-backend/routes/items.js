import express from "express";
import FishItem from "../models/FishItem.js";
import { protect, admin } from "../middleware/auth.js";
const router = express.Router();

// @desc    Get all categories
// @route   GET /api/items/categories
// @access  Public
router.get("/categories", async (req, res) => {
  try {
    const categories = await FishItem.distinct("category");
    res.json(categories.filter(Boolean)); // Remove any null/undefined values
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: "i" };
    }
    if (req.query.category && req.query.category !== "all") {
      query.category = req.query.category;
    }

    const items = await FishItem.find(query).skip(skip).limit(limit);

    const totalItems = await FishItem.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      items,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Get all fish items (admin)
// @route   GET /api/items/admin
// @access  Private/Admin
router.get("/admin", protect, admin, async (req, res) => {
  try {
    const items = await FishItem.find({});
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Create new fish item
// @route   POST /api/items
// @access  Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const item = new FishItem({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stockQuantity: req.body.stockQuantity,
      category: req.body.category,
      image: req.body.image,
    });

    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    console.error(error); // Add this to see detailed error
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res
        .status(400)
        .json({ message: "Validation Error", errors: messages });
    }
    res.status(400).json({ message: "Invalid item data" });
  }
});

// @desc    Update fish item
// @route   PUT /api/items/:id
// @access  Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const item = await FishItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.name = req.body.name || item.name;
    item.description = req.body.description || item.description;
    item.price = req.body.price || item.price;
    item.stockQuantity = req.body.stockQuantity || item.stockQuantity;
    item.image = req.body.image || item.image;
    item.category = req.body.category || item.category;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: "Invalid item data" });
  }
});

// @desc    Delete fish item
// @route   DELETE /api/items/:id
// @access  Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const deletedItem = await FishItem.findByIdAndDelete(req.params.id); // Use findByIdAndDelete

    if (!deletedItem) {
      // findByIdAndDelete returns null if no document was found and deleted
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
export default router;
