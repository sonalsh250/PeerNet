//entry point for API

import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js"

import {connectDB} from "./lib/db.js"

dotenv.config(); //to read value from "process.env.PORT"

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); //parse json

app.use("/api/v1/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});