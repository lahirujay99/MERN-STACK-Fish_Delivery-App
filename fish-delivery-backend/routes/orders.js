import express from "express";
import { protect } from "../middleware/auth.js";
import Order from "../models/Order.js"; // Import the Order model

const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post("/", protect, async (req, res) => {
  console.log("Received req.body in /api/orders:", req.body);
  try {
    const { items, deliveryInformation, total } = req.body; // Correctly named deliveryInformation to match your model

    // Validate order data (basic validation - enhance as needed)
    if (!items || items.length === 0 || !deliveryInformation || !total) {
      return res
        .status(400)
        .json({ message: "Invalid order data. Missing required fields." });
    }

    // 1. Prepare order items for saving. Ensure correct item structure
    const orderItems = items.map((item) => ({
      item: item.item._id, // Assuming item is populated and has item._id
      quantity: item.quantity,
      price: item.price,
    }));

    // 2. Create a new Order document
    const newOrder = new Order({
      user: req.user._id, // Associate order with logged in user
      items: orderItems, // Use the prepared order items array
      totalAmount: total, // Use total from request body - match your model field name `totalAmount`
      deliveryInformation, // Use deliveryInformation from request body - match your model field name `deliveryInformation`
    });

    // 3. Save the order to the database
    const createdOrder = await newOrder.save();

    // 4. Populate the 'items.item' field before sending the response (optional, but useful to get full item details back)
    await createdOrder.populate("items.item"); // Populate the item details in the response

    // 5. Respond with the created order and 201 status (Created)
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    if (error.name === "ValidationError") {
      // Mongoose validation error - send details to client
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
