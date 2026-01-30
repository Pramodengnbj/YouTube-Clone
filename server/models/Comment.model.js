import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide a user Id']
    },
    videoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
        required: [true, 'Please provide a video Id']
    },
    description: {
        type: String,
        required: [true, 'Please provide a description']
    }
}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;