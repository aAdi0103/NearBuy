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
    role: {
        type: String,
        trim:true
    },
    About:{
        type:String
    },
    password: {
        type: String,
        required: true
    },
    location: { 
        city: { type: String},
        state: { type: String},
        country: { type: String}
    },
    profilePic: {
        type: String, // URL to the profile picture
        default: "default-profile.png"
    },
    Phone: {
         type:String
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post" // Refers to the Post model
        }
    ],
    services: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service" // Refers to the Service model
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const User = mongoose.model("User",UserSchema);
export default User;