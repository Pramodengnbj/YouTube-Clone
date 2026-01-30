import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { addComment, deleteComment, getComments, updateComment } from "../controllers/comment.controller.js";

const router = express.Router();

// Endpoints
// POST /api/comments
router.post("/", verifyToken, addComment);

// DELETE /api/comments/12345
router.delete("/:id", verifyToken, deleteComment);

// PUT /api/comments/12345
router.put("/:id", verifyToken, updateComment);

// GET /api/comments/54321
router.get("/:videoId", getComments);

export default router;