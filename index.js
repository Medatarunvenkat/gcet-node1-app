// const express = require("express");
// const cors = require("cors");
// const mongoose=require("mongoose");
// import userModel from "./models/userModel"
// import productModel from "./models/productModel"
// const app = express();
// app.use(cors());
// app.use(express.json())
// app.listen(8080,()=>{
//   mongoose.connect("mongodb://localhost:27017/gcet");
//     console.log("Server Started on port 8080 and mongodb connected");
// });

// // const userSchema=mongoose.Schema({
// //   name:{type:String},
// //   email:{type:String},
// //   pass:{type:String},
// // });

// // const user=mongoose.model("User",userSchema);


// app.get("/", (req, res) => {
//   const html = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <title>Node JS API's Routes</title>
//     </head>
//     <body>
//       <h1>Node JS API's Routes</h1>
//       <ul>
//         <li><a href="/greet">Greet</a></li>
//         <li><a href="/name">Name</a></li>
//         <li><a href="/weather">Weather</a></li>
//         <li><a href="/products">Products</a></li>
//       </ul>
//     </body>
//     </html>
//   `;
//   res.send(html);
// });

// app.get("/greet",(req,res)=>{
//     return res.send("Hello Greetings");
// });

// app.get("/name",(req,res)=>{
//   return res.send("<h1>Hello Tarun</h1>");
// });

// app.get("/weather",(req,res)=>{
//   return res.send("Weather is sunny 40 degrees");
// })


// app.get("/products",async(req,res)=>{
//   const products=await product.find({})
//   return res.json(products);
// })


// app.post("/register", async(req,resp)=>{
//   const {name,email,pass}=req.body;
//     const res=await userModel.insertMany({name,email,pass});  
//     return resp.json(res);
// })

// app.post("/login",async(req,resp)=>{
//   const {email,pass}=req.body;
//   const found=await user.findOne({email,pass});
//   if(found)
//   {
//     return resp.json({"message":"Login Success"});
//   }
//   else
//   {
//     return resp.json({"message":"Login UnSuccess"});
//   }
// })

// // const productSchema=mongoose.Schema({
// //   name:{type:String},
// //   price:{type:Number},
// // });

// // const product=mongoose.model("Product",productSchema);

// app.post("/products",async(req,resp)=>{
//   const {name,price}=req.body;
//   const found=await productModel.findOne({name,price:Number(price)});
//   if(found)
//   {
//     return resp.json(found);
//   }
//   else
//   {
//     return resp.json({message:"Products not found"});
//   }
// })


import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import productRouter from "./Routes/productRoutes.js";
import userRouter from "./Routes/userRoutes.js";
import orderRouter from "./Routes/orderRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/order",orderRouter);
app.listen(8080, () => {
  mongoose.connect("mongodb://localhost:27017/gcet");
  console.log("Server Started");
});