import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be atleast 6 characters']
    },
    avatar: {
        type: String,
        default: ""
    },
    channels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel"
    }],
    subscribedChannels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel"
    }],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;

