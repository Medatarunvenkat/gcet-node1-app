import express from 'express';
import mongoose from 'mongoose';

const orderRouter = express.Router();

// Import the Order model from userRoutes.js
const Order = mongoose.model('Order');

// Get all orders (admin route)
orderRouter.get("/all", async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ orderDate: -1 });
        return res.json(orders);
    } catch (error) {
        console.error("Error fetching all orders:", error);
        return res.status(500).json({ error: "Failed to fetch orders" });
    }
});

// Get orders by user email
orderRouter.get("/user/:email", async (req, res) => {
    try {
        const email = req.params.email;
        
        // First find the user with this email
        const User = mongoose.model('User');
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        // Then find all orders for this user
        const orders = await Order.find({ userId: user._id }).sort({ orderDate: -1 });
        return res.json(orders);
    } catch (error) {
        console.error("Error fetching orders by email:", error);
        return res.status(500).json({ error: "Failed to fetch orders" });
    }
});

// Create a new order (legacy route - for backward compatibility)
orderRouter.post("/new", async (req, res) => {
    try {
        const { email, orderValue, items, paymentMethod, deliveryAddress } = req.body;
        
        // Find user by email
        const User = mongoose.model('User');
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        // Create new order with minimal information
        const newOrder = new Order({
            userId: user._id,
            totalAmount: orderValue || 0,
            items: items || [],
            paymentMethod: paymentMethod || 'cod',
            deliveryAddress: deliveryAddress || 'Not provided'
        });
        
        const savedOrder = await newOrder.save();
        
        return res.status(201).json({
            message: "Order created successfully",
            orderId: savedOrder._id
        });
    } catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({ error: "Failed to create order" });
    }
});

// Update order status
orderRouter.patch("/:orderId/status", async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({ error: "Status is required" });
        }
        
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );
        
        if (!updatedOrder) {
            return res.status(404).json({ error: "Order not found" });
        }
        
        return res.json({
            message: "Order status updated successfully",
            order: updatedOrder
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        return res.status(500).json({ error: "Failed to update order status" });
    }
});

export default orderRouter;