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

// @route   PUT /api/cart/
// @desc    Update cart item quantity
// @access  Private
router.put("/", protect, async (req, res) => {
  const { itemId, quantity } = req.body;

  console.log("PUT /api/cart/ route HIT"); // ADD THIS LINE for debugging
  console.log("Request Body:", req.body); // ADD THIS LINE for debugging

  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" }); // This "not found" is about CART, not fish item
    }

    const existingItemIndex = cart.items.findIndex(
      (i) => i.item.toString() === itemId
    );

    console.log("Received itemId for update:", itemId); // Log the itemId from request body
    console.log(
      "Cart Items in DB:",
      cart.items.map((item) => item.item.toString())
    ); // Log _id of items in cart
    console.log("existingItemIndex:", existingItemIndex); // Log index found or -1

    if (existingItemIndex !== -1) {
      // Update existing item quantity
      if (quantity <= 0) {
        // If quantity is zero or less, remove the item from the cart
        cart.items.splice(existingItemIndex, 1);
      } else {
        cart.items[existingItemIndex].quantity = quantity;
      }
    } else if (quantity > 0) {
      // Item not in cart, handle error or adding a new item as needed
      // For update quantity, it should ideally be in the cart already.
      return res
        .status(404)
        .json({ message: "Item not found in cart to update" }); // "Item not found" IN CART.
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

// @route   DELETE /api/cart/remove/:itemId
// @desc    Remove an item from the cart
// @access  Private
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
    res.json(populatedCart); // Or send success message and updated cart info.
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ message: "Server error removing item from cart" });
  }
});

// @route   DELETE /api/cart/clear
// @desc    Clear the entire cart
// @access  Private
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
