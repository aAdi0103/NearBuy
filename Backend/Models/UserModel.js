import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    location: { 
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true }
    },
    profilePic: {
        type: String, // URL to the profile picture
        default: "default-profile.png"
    },
    contactDetails: {
        phone: {
            type: String,
        },
        alternatePhone: {
            type: String
        },
        contactEmail: {
            type: String,
            lowercase: true
        },
        address: {
            street: String,
            city: String,
            state: String,
            country: String,
            zip: String
        }
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post" // Refers to the Post model
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const User = mongoose.model("User",UserSchema);
export default User;