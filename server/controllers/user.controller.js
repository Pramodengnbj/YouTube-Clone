import User from "../models/User.model.js";
import Video from "../models/Video.model.js";
import Channel from "../models/Channel.model.js";
import { createError } from "../utils/error.js";

// Update User (Profile)
export const updateUser = async (req, res, next) => {
    if(req.params.id === req.user.id) {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            );
            return res.status(200).json(updatedUser);
        } catch(err) {
            next(err);
        }
    } else {
        return next(createError(403, "You can update only your account!"));
    }
};

// Delete User
export const deleteUser = async (req, res, next) => {
    if(req.params.id === req.user.id) {
        try {
            await User.findByIdAndDelete(req.params.id);
            return res.status(200).json("User has been deleted.");
        } catch(err) {
            next(err);
        }
    } else {
        return next(createError(403, "You can delete only your account!"));
    }
};

// Get User
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch(err) {
        next(err);
    }
};

// PUT Subscribe to Channel
export const subscribe = async (req, res, next) => {
    try {
        // Add channelId to the current user's 'subscribedUsers'
        await User.findByIdAndUpdate(req.user.id, {
            $push: { subscribedChannels: req.params.id }
        });

        // Increase the 'subscribers' count of the channel
        await Channel.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: 1 } 
        });
        res.status(200).json("Subscription successful.");
    } catch(err) {
        next(err);
    }
};

// PUT Unsubscribe to Channel
export const unsubscribe = async (req, res, next) => {
    try {
        // Remove channelId from the current user's list
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { subscribedChannels: req.params.id }
        });

        // Decrease the 'subscribers' count of the channel
        await Channel.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: -1 } 
        });
        res.status(200).json("Unsubscription successful.");
    } catch(err) {
        next(err);
    }
};

// Like Video
export const like = async (req, res, next) => {
    const id = req.user.id;
    const videoId = req.params.videoId;
    try {
        await Video.findByIdAndUpdate(videoId, {
            $addToSet: { likes: id },
            $pull: { dislikes: id }
        });
        return res.status(200).json("The video has been liked.");
    } catch(err) {
        next(err);
    }
};

// Dislike Video
export const dislike = async (req, res, next) => {
    const id = req.user.id;
    const videoId = req.params.videoId;
    try {
        await Video.findByIdAndUpdate(videoId, {
            $addToSet: { dislikes: id },
            $pull: { likes: id }
        });
        return res.status(200).json("The video has been disliked.");
    } catch(err) {
        next(err);
    }
};