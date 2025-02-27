import express from "express";
import { protect } from "../middleware/auth.js";
import Order from "../models/Order.js";

const router = express.Router();

// @route   POST /api/orders
router.post("/", protect, async (req, res) => {
  console.log("Received req.body in /api/orders:", req.body);
  try {
    const { items, deliveryInformation, total } = req.body;

    if (!items || items.length === 0 || !deliveryInformation || !total) {
      return res
        .status(400)
        .json({ message: "Invalid order data. Missing required fields." });
    }

    const orderItems = items.map((item) => ({
      item: item.item._id,
      quantity: item.quantity,
      price: item.price,
    }));

    const newOrder = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount: total,
      deliveryInformation,
    });

    const createdOrder = await newOrder.save();

    // 4. Populate the 'items.item' field before sending the response
    await createdOrder.populate("items.item"); // Populate the item details in the response

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Order validation failed", errors: error.errors });
    }
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
});

export default router;
