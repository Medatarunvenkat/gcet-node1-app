import mongoose from 'mongoose';

// This file is kept for backward compatibility
// The actual User model is now defined in userRoutes.js

// Reference the existing User model
const User = mongoose.model("User");

export default User;