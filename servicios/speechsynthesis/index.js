//import "./src/database.js";
//import "dotenv/config.js";
import express from "express";
//import mongoose from "mongoose";
import { routes } from './src/routes/audio.js';

var app = express();
var port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(routes);

app.listen(port, ()=>{
  console.log("Server listening to", port)
});