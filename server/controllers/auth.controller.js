import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { createError } from "../utils/error.js";

// Sign Up
export const signup = async (req, res, next) => {
    try {
        const { username, email, password, avatar } = req.body;
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if(existingUser) return res.status(400).json({ message: "User already exists" });
        // Encrypt the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create and Save the new User
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            avatar
        });
        const savedUser = await newUser.save();
        // Respond (Exclude password from response)
        const { password: _, ...others } = savedUser._doc;
        return res.status(201).json(others);
    } catch(err) {
        next(err);
    }
};

// Sign In
export const signin = async (req, res, next) => {
    try {
        // Find User
        const user = await User.findOne({ username: req.body.username });
        if(!user) return next(createError(404, "User not found!"));
    
        // Validate Password
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if(!isPasswordCorrect) return next(createError(400, "Incorrect Password!" ));

        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // Remove password from response
        const { password, ...others } = user._doc;

        return res.status(200).json({ token, details: others});
    } catch(err) {
        next(err);
    }
};