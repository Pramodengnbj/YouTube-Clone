import User from "../models/User.model.js";
import Channel from "../models/Channel.model.js";
import Comment from "../models/Comment.model.js";
import Video from "../models/Video.model.js";
import { createError } from "../utils/error.js";

// Add Video (Upload)
export const addVideo = async (req, res, next) => {
    const { channelId } = req.body;
    try {
        // Validate: Does this channel exist
        const channel = await Channel.findById(channelId);
        if(!channel) return next(createError(404, "Channel not found!"));
        // Validate: Does the logged-in User own this channel
        if(channel.owner.toString() !== req.user.id) {
            return next(createError(403, "You can only upload to your own channel!"));
        }
        // Create Video
        const newVideo = new Video({
            userId: req.user.id,
            channelId: channelId,
            ...req.body
        });
        const savedVideo = await newVideo.save();
        // Update Channel: Add Video ID to channel's video list
        await Channel.findByIdAndUpdate(channelId, {
            $push: { videos: savedVideo._id }
        });
        return res.status(200).json(savedVideo);
    } catch(err) {
        next(err);
    }
};

// Update Video
export const updateVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if(!video) return next(createError(404, "Video not found!"));
        // Find the channel this video belongs to
        const channel = await Channel.findById(video.channelId);
        // Check Ownership via Channel Owner
        if(req.user.id === channel.owner.toString()) {
            const updatedVideo = await Video.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            );
            return res.status(200).json(updatedVideo);
        } else {
            return next(createError(403, "You can update only your video!"));
        }
    } catch(err) {
        next(err);
    }
};

// Delete Video
export const deleteVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if(!video) return next(createError(404, "Video not found!"));
        const channel = await Channel.findById(video.channelId);
        // Check Ownership via Channel Owner
        if(req.user.id === channel.owner.toString()) {
            // Delete Video
            await Video.findByIdAndDelete(req.params.id);
            // Remove Video ID from Channel's list
            await Channel.findByIdAndUpdate(video.channelId, {
                $pull: { videos: req.params.id }
            });
            await Comment.deleteMany({ videoId: req.params.id });
            return res.status(200).json("The video has been deleted.");
        } else {
            return next(createError(403, "You can delete only your video!"));
        }
    } catch(err) {
        next(err);
    }
};

// Get Single Video
export const getVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        return res.status(200).json(video);
    } catch(err) {
        next(err);
    }
};

// Add View
export const addView = async (req, res, next) => {
    try {
        await Video.findByIdAndUpdate(req.params.id, {
            $inc: { views: 1 },
        });
        return res.status(200).json("The view has been increased.");
    } catch(err) {
        next(err);
    }
};


// Get Random Videos for Home Page
export const randomVideos = async (req, res, next) => {
    try {
        // Fetch 40 random videos
        const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
        return res.status(200).json(videos);
    } catch(err) {
        next(err);
    }
};

// Get Trending Videos
export const getTrend = async (req, res, next) => {
    try {
        const videos = await Video.find().sort({ views: -1 });
        return res.status(200).json(videos);
    } catch(err) {
        next(err);
    }
};

// Get Subscribed Videos
export const sub = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const subscribedChannels = user.subscribedChannels;

        const list = await Promise.all(
            subscribedChannels.map((channelId) => {
                return Video.find({ channelId: channelId });
            })
        );

        // Flatten array amd sort by newest first
        const videos = list.flat().sort((a, b) => b.createdAt = a.createdAt);

        return res.status(200).json(videos);
    } catch(err) {
        next(err);
    }
};

// Get Videos by Tags
export const getByTag = async (req, res, next) => {
    // Split query string into array
    const tags = req.query.tags.split(",");
    try {
        // Find videos where the 'tags' array contains any of the tags in out list 
        const videos = await Video.find({ tags: { $in: tags } }).limit(20);
        res.status(200).json(videos);
    } catch(err) {
        next(err);
    }
};

// Get Search Videos
export const search = async (req, res, next) => {
    // Get the "q" parameter from URL
    const query = req.query.q;
    try {
        // $regex: Finds partial matches
        // $options: "i" makes it case-sensitive 
        const videos = await Video.find({ 
            title: { $regex: query, $options: "i" }, 
        }).limit(40);
        res.status(200).json(videos);
    } catch(err) {
        next(err);
    }
};

// Get Videos by Channel (For Channel Page)
export const getByChannel = async (req, res, next) => {
    try {
        const videos = await Video.find({ channelId: req.params.channelId });
        res.status(200).json(videos);
    } catch(err) {
        next(err);
    }
};