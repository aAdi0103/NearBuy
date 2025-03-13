import mongoose from "mongoose"

const PostSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000
    },
    images: [
        {
            type: String, // Store image URLs
        }
    ],
    location: { 
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true }
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity:{
        type:Number,
        required: true,
    },
    condition:{
        type: String,
        enum: ["New", "Like New", "Used", "Refurbished"],
        required: true
    },
    category: {
        type: String,
        enum: ["Real Estate", "Furniture", "Electronics", "Fashion", "Sports","Books","Others"],
        required: true
    },   
    datePosted: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to User model
        required: true
    }

});


const Post = mongoose.model("Post",PostSchema);
export default Post;