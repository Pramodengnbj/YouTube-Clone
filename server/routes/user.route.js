import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { deleteUser, dislike, getUser, like, subscribe, unsubscribe, updateUser } from "../controllers/user.controller.js";

const router = express.Router();

// Endpoints
// PUT /api/users/12345
router.put("/:id", verifyToken, updateUser);

// DELETE /api/users/12345
router.delete("/:id", verifyToken, deleteUser);

// GET /api/users/find/12345
router.get("/find/:id", getUser);

// PUT /api/users/sub/54321
router.put("/sub/:id", verifyToken, subscribe);

// PUT /api/users/unsub/54321
router.put("/unsub/:id", verifyToken, unsubscribe);

// PUT /api/users/like/98765
router.put("/like/:id", verifyToken, like);

// PUT /api/users/dislike/98765
router.put("/dislike/:id", verifyToken, dislike);

export default router;