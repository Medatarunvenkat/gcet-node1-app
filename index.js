const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.listen(8080,()=>{
    console.log("Server Started on port 8080");
});

app.get("/",(req,res)=>{
  return res.send("Hello GM");
});

app.get("/greet",(req,res)=>{
    return res.send("Hello Greetings");
});

app.get("/name",(req,res)=>{
  return res.send("<h1>Hello Tarun</h1>");
});

app.get("/weather",(req,res)=>{
  return res.send("Weather is sunny 40 degrees");
})

const products = [
  { id: 1,name:"Product 1",price:100},
  { id: 2,name:"Product 2",price:200},
  { id: 3,name:"Product 3",price:300}
];
app.get("/products",(req,res)=>{
 return res.json(products);
})
