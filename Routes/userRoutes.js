// import express from 'express'
// import userModel from '../models/userModel.js'

// const userRouter = express.Router();

// userRouter.post("/register", async (req,res) => {
//    const { name,email,pass } = req.body;
//    const result = await userModel.insertOne({ name: name,email: email,pass: pass });
//    return res.json(result);
// });

// userRouter.post("/login", async (req,res) => {
//     const { email,pass } = req.body;
//   const result = await userModel.findOne({email:email,pass:pass});
//   if(result){
//     return res.json(result);
//   }
//   else{
//     return res
//   }
// });

// userRouter.get("/:id", async (req,res) => {
//   const email = req.params.id;
//   const result = await userModel.findOne({email},{_id:0,name:1})
//   return res.json(result);
// });
// export default userRouter

import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// User Schema
const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

// Order Schema
const orderSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 }
  }],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentDetails: { type: Object },
  deliveryAddress: { type: String, required: true },
  orderDate: { type: Date, default: Date.now },
  status: { type: String, default: 'Pending' }
});

const Order = mongoose.model("Order", orderSchema);

// Register Route
router.post("/register", async (req, res) => {
  try {
    const { name, email, pass } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }
    
    // Create new user
    const newUser = new User({ name, email, pass });
    const savedUser = await newUser.save();
    
    // Return success response (don't return password)
    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, pass } = req.body;
    
    // Find user with email and password
    const user = await User.findOne({ email, pass });
    
    if (user) {
      // Return user data (don't return password)
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        message: "Login Success"
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

// Get all users (optional - for testing)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, { pass: 0 }); // Exclude password
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Create a new order
router.post("/orders", async (req, res) => {
  try {
    const { userId, items, totalAmount, paymentMethod, paymentDetails, deliveryAddress } = req.body;
    
    // Validate required fields
    if (!userId || !items || !totalAmount || !paymentMethod || !deliveryAddress) {
      return res.status(400).json({ error: "Missing required order information" });
    }
    
    // Validate user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Create new order
    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      paymentMethod,
      paymentDetails: paymentMethod === 'card' ? 
        // Remove sensitive card data
        { 
          cardNumber: paymentDetails.cardNumber ? 
            `xxxx-xxxx-xxxx-${paymentDetails.cardNumber.slice(-4)}` : '',
          cardHolderName: paymentDetails.cardHolderName,
          expiryDate: paymentDetails.expiryDate
          // CVV is intentionally not stored
        } : 
        paymentDetails,
      deliveryAddress
    });
    
    const savedOrder = await newOrder.save();
    
    res.status(201).json({
      message: "Order placed successfully",
      orderId: savedOrder._id,
      orderDate: savedOrder.orderDate,
      status: savedOrder.status
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ error: "Failed to place order. Please try again." });
  }
});

// Get orders for a specific user
router.get("/orders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const orders = await Order.find({ userId }).sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Get a specific order by ID
router.get("/order/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order details" });
  }
});

export default router;