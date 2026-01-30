import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a video title']
    },
    description: {
        type: String,
    },
    thumbnailUrl: {
        type: String,
        required: [true, 'Please provide a thumbnail url']
    },
    videoUrl: {
        type: String,
        required: [true, 'Please provide a video url']
    },
    channelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: [String],
        default: []
    },
    dislikes: {
        type: [String],
        default: []
    },
    tags: {
        type: [String],
        default: []
    }
}, { timestamps: true });

const Video = mongoose.model("Video", videoSchema);

export default Video;