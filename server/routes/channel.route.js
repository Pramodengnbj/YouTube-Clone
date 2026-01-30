import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { createChannel, updateChannel, deleteChannel, getChannel } from "../controllers/channel.controller.js";

const router = express.Router();

// Endpoints
// CREATE: POST /api/channels
router.post("/", verifyToken, createChannel);

// READ: GET /api/channels/find/12345
router.get("/find/:id", getChannel);

// UPDATE: PUT /api/channels/12345
router.put("/:id", verifyToken, updateChannel);

// DELETE: DELETE /api/channels/12345
router.delete("/:id", verifyToken, deleteChannel);

export default router;