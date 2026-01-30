import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Routes
import authRoutes from "./routes/auth.route.js";
import videoRoutes from "./routes/video.route.js";
import commentRoutes from "./routes/comments.route.js";
import userRoutes from "./routes/user.route.js";
import channelRoutes from "./routes/channel.route.js";

// Configuration
dotenv.config();

// Express Instance
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Allows server to accept JSON data
app.use(cors()); // Allows connection from React

// Database Connection
const connectDB = async () => { 
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected Successfully!");
    } catch (err) {
        console.error("MongoDB Connection Failed: ", err.message);
        process.exit(1);
    }
};

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/channels", channelRoutes);

// Error Handler Middleware
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong!";
    return res.status(status).json({
        success: false,
        status,
        message,
    });
});

// Basic Route
app.get('/', (req, res) => {
    res.send("YouTube Clone API is running...");
});

// Start Server
app.listen(PORT, () => {
    connectDB();
    console.log(`SERVER RUNNING ON PORT: ${PORT}`);
});