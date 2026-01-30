import Channel from "../models/Channel.model.js";
import User from "../models/User.model.js";
import Video from "../models/Video.model.js";
import Comment from "../models/Comment.model.js";
import { createError } from "../utils/error.js";

// Create a new Channel
export const createChannel = async (req, res, next) => {
    try {
        // Basic Validation
        if(!req.body.handle) return next(createError(400, "Handle is required!"));
        // Create the Channel
        const newChannel = new Channel({
            owner: req.user.id,
            ...req.body
        });
        // Save the Channel to the DB
        const savedChannel = await newChannel.save();
        // Add this Channel ID to the User's "channels" list
        await User.findByIdAndUpdate(req.user.id, {
            $push: { channels: savedChannel._id }
        });
        return res.status(200).json(savedChannel);
    } catch(err) {
        // Handle Duplicate Key Error (if handle already exists)
        if(err.code === 11000) {
            return res.status(409).json({ message: "Handle already taken!" });
        }
        next(err);
    }
};

// Get Channel details
export const getChannel = async (req, res, next) => {
    try {
        const channel = await Channel.findById(req.params.id);
        if(!channel) return next(createError(404, "Channel not found!"));
        return res.status(200).json(channel);
    } catch(err) {
        next(err);
    }
};

// Update Channel
export const updateChannel = async (req, res, next) => {
    try {
        // Find the Channel
        const channel = await Channel.findById(req.params.id);
        if(!channel) return next(createError(404, "Channel not found!"));
        // Only the Owner (User) can edit this Channel
        if(channel.owner.toString() !== req.user.id) {
            return next(createError(403, "You can only update your own channel!"));
        }
        const { channelName, description, handle, channelAvatar, channelBanner } = req.body;
        const updateData = {
            ...(channelName && { channelName }),
            ...(handle && { handle }),
            ...(channelAvatar && { channelAvatar }),
            ...(channelBanner && { channelBanner }),
            ...(description && { description }),
        }
        // Update Data
        const updatedChannel = await Channel.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );
        return res.status(200).json(updatedChannel);
    } catch(err) {
        next(err);
    }
};

// Delete Channel
export const deleteChannel = async (req, res, next) => {
    try {
        const channel = await Channel.findById(req.params.id);
        if(!channel) return next(createError(404, "Channel not found!"));
        // Ensure only the owner can delete
        if(channel.owner.toString() !== req.user.id) {
            return next(createError(403, "You can only delete your own channel!"));
        }
        // Find all videos to get their IDs
        const videos = await Video.find({ channelID: req.params.id });
        const videoIds = videos.map(video => video._id);
        // Delete all comments on those videos
        await Comment.deleteMany({ videoId: { $in: videoIds } });
        // Delete all videos uploaded to this channel
        await Video.deleteMany({ channelId: req.params.id });
        // Delete the Channel
        await Channel.findByIdAndDelete(req.params.id);
        // Remove Channel ID from User's list
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { channels: req.params.id }
        });
        return res.status(200).json("Channel has been deleted.");
    } catch(err) {
        next(err);
    }
};