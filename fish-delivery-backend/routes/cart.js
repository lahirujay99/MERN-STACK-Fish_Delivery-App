import express from "express";
import Cart from "../models/Cart.js";
import FishItem from "../models/FishItem.js";
import { protect } from "../middleware/auth.js";
const router = express.Router();

// @route   GET /api/cart
router.get("/", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.item"
    );
    res.json(cart || { items: [], total: 0 });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/cart/add
router.post("/add", protect, async (req, res) => {
  const { itemId, quantity } = req.body;

  try {
    const item = await FishItem.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.stock < quantity)
      return res.status(400).json({ message: "Insufficient stock" });

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find((i) => i.item.toString() === itemId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ item: itemId, quantity, price: item.price });
    }

    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Update cart item quantity
router.put("/", protect, async (req, res) => {
  const { itemId, quantity } = req.body;

  console.log("PUT /api/cart/ route HIT");
  console.log("Request Body:", req.body);

  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const existingItemIndex = cart.items.findIndex(
      (i) => i.item.toString() === itemId
    );

    console.log("Received itemId for update:", itemId);
    console.log(
      "Cart Items in DB:",
      cart.items.map((item) => item.item.toString())
    );
    console.log("existingItemIndex:", existingItemIndex); // Log index found or -1

    if (existingItemIndex !== -1) {
      if (quantity <= 0) {
        cart.items.splice(existingItemIndex, 1);
      } else {
        cart.items[existingItemIndex].quantity = quantity;
      }
    } else if (quantity > 0) {
      return res
        .status(404)
        .json({ message: "Item not found in cart to update" });
    }

    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    await cart.save();

    const populatedCart = await Cart.findOne({ user: req.user._id }).populate(
      "items.item"
    );
    res.json(populatedCart);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Server error updating cart" });
  }
});

// @desc    Remove an item from the cart
router.delete("/remove/:itemId", protect, async (req, res) => {
  const itemId = req.params.itemId;

  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const initialItemCount = cart.items.length;
    cart.items = cart.items.filter((item) => item.item.toString() !== itemId); // Filter out the item to remove
    const itemsRemoved = initialItemCount > cart.items.length; // Check if an item was actually removed

    if (!itemsRemoved) {
      return res.status(404).json({ message: "Item not found in cart" }); // Item ID wasn't in cart.
    }

    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    await cart.save();

    const populatedCart = await Cart.findOne({ user: req.user._id }).populate(
      "items.item"
    );
    res.json(populatedCart); // send success message and updated cart info.
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ message: "Server error removing item from cart" });
  }
});

// @route   DELETE /api/cart/clear
router.delete("/clear", protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = []; // Clear items array
      cart.total = 0; // Reset total
      await cart.save();
      res.json({ message: "Cart cleared", cart });
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Server error clearing cart" });
  }
});

export default router;
