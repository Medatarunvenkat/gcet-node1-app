const express = require("express");
const app = express();
app.listen(8080,()=>{
    console.log("Server Started on port 8080");
});

app.get("/",(req,res)=>{
  return res.send("Hello Tarun");
});

app.get("/greet",(req,res)=>{
    return res.send("Hello Greetings");
});
