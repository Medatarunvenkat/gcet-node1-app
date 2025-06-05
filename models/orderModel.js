import mongoose from 'mongoose';

// This file is kept for backward compatibility
// The actual Order model is now defined in userRoutes.js

// Reference the existing Order model
const Order = mongoose.model("Order");

export default Order;