const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: true,
        trim: true
    },
    bio: {
        type: String,
        required: true,
        maxlength: 1000
    },
    images: [
        {
            type: String, // Store image URLs
            required: true
        }
    ],
    location: {
        city: String,
        state: String,
        country: String
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        enum: ["Real Estate", "Job Listing", "Service", "Product", "Other"],
        required: true
    },   
    status: {
        type: String,
        enum: ["Available", "Sold", "Expired"],
        default: "Available"
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

module.exports = mongoose.model("Post", PostSchema);
