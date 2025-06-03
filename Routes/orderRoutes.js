import express from 'express';
import orderModel from "../models/orderModel.js";

const orderRouter = express.Router()

orderRouter.get("/:id", async (req, res) => {
    const email=req.params.id;
    const result=await orderModel.find({email},{});
    return res.json(result);
});


orderRouter.post("/new",async(req,res)=>{
    const {email,orderValue} = req.body;
   const result = await orderModel.insertOne({email:email,orderValue:orderValue});
   return res.json(result);
})




export default orderRouter