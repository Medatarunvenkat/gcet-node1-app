import express from 'express';
import orderModel from "../models/orderModel.js";

const orderRouter = express.Router()

orderRouter.get("/:id", async (req, res) => {
    const email=req.params.id;
    const result=await orderModel.find({email},{});
    return res.json(result);
});

orderRouter.post("/new", async (req, res) => {
  const { email, orderValue } = req.body;
  try {
    const result = await orderModel.create({ email, orderValue });
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: "Failed to place order" });
  }
});
export default orderRouter