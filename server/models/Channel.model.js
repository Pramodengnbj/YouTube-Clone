import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    channelName: {
        type: String,
        required: true,
        trim: true
    },
    handle: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    channelAvatar: {
        type: String,
        default: ""
    },
    channelBanner: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    },
    subscribers: {
        type: Number,
        default: 0
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }]
}, { timestamps: true });

const Channel = mongoose.model("Channel", channelSchema);

export default Channel;