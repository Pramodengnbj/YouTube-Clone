import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const verifyToken = (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1]; // Except "Bearer <token>"

    // If still no token, return error
    if(!token) return next(createError(401, "You are not authenticated!"));

    // Verify Token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) return next(createError(403, "Token is not valid!"));
        req.user = user;
        next();
    });
};