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
});

const User = mongoose.model("User", userSchema);

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

export default router;