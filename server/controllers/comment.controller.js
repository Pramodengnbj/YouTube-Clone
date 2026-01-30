import Video from "../models/Video.model.js";
import Comment from "../models/Comment.model.js";
import Channel from "../models/Channel.model.js";
import { createError } from "../utils/error.js";

// Add Comment
export const addComment = async (req, res, next) => {
    // We keep track of userId so we jnow who wrote it
    const newComment = new Comment({ ...req.body, userId: req.user.id });
    try {
        const savedComment = await newComment.save();
        return res.status(200).send(savedComment);
    } catch(err) {
        next(err);
    };
};

// Delete Comment
export const deleteComment = async (req, res, next) => {
    try {
        // Ensure both comment and video exist
        const comment = await Comment.findById(req.params.id);
        if(!comment) return next(createError(404, "Comment not found!"));

        const video = await Video.findById(comment.videoId);
        if(!video) return next(createError(404, "Video not found!"));

        const channel = await Channel.findById(video.channdelId);

        // Allow delete if User is the Comment Owner OR the Video Owner
        if(req.user.id === comment.userId.toString() || req.user.id === channel.owner.toString()) {
            await Comment.findByIdAndDelete(req.params.id);
            return res.status(200).json("The comment has been deleted.");
        } else {
            return next(createError(403, "You can delete only your comment!"));
        }
    } catch(err) {
        next(err);
    };
};

// Update Comment
export const updateComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if(!comment) return next(createError(404, "Comment not found!"));

        // Only the comment author can edit
        if(req.user.id === comment.userId.toString()) {
            const updatedComment = await Comment.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            );
            return res.status(200).json(updatedComment);
        } else {
            return next(createError(403, "You can update only your comment!"));
        }
    } catch(err) {
        next(err);
    };
};

// Get All Comments
export const getComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ videoId: req.params.videoId }).sort({ createdAt: -1 });
        return res.status(200).json(comments);
    } catch(err) {
        next(err);
    };
};


