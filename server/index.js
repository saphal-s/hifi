import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import userRoute from "./routes/user.js";
import { app, server } from "./socket/index.js";
dotenv.config();
connectDB();

app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    credentials: true, // Allow credentials (cookies)
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use("/uploads/", express.static("uploads"));

const port = process.env.PORT || 5000;

// routes
app.use("/api", userRoute);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
