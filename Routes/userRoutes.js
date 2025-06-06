import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const SECRET_KEY = "tarun0909";
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
    const hashpassword = await bcrypt.hash(pass,10);
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }
    
    // Create new user
    const newUser = new User({ name, email, pass:hashpassword });
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

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token=jwt.sign({email:user.email,id:user._id},SECRET_KEY)
    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(pass, user.pass);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Return user data (excluding password)
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token:token,
      message: "Login Success"

    });
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