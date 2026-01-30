import express from "express";
import { addVideo, addView, deleteVideo,  getByChannel, getByTag, getTrend, getVideo, randomVideos, search, sub, updateVideo } from "../controllers/video.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Endpoints
// GET /api/videos/random
router.get("/random", randomVideos);

// GET /api/videos/thrend
router.get("/thrend", getTrend);

// GET /api/videos/search
router.get("/search", search);

// GET /api/videos/tags
router.get("/tags", getByTag);

// GET /api/videos/channel/98765
router.get("/channel/:channelId", getByChannel);

// GET /api/videos/find/12345
router.get("/find/:id", getVideo);

// PUT /api/videos/view/54321
router.put("/view/:id", addView);

// POST /api/videos
router.post("/", verifyToken , addVideo);

// GET /api/videos/sub
router.get("/sub", verifyToken, sub);

// DELETE /api/videos/54321
router.delete("/:id", verifyToken, deleteVideo);

// PUT /api/videos/54321
router.put("/:id", verifyToken , updateVideo);

export default router;