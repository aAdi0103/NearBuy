const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000
    },
    category: {
        type: String,
        enum: ["Tutoring", "Laundry", "Home Repair", "Plumbing", "Cleaning", "Other"],
        required: true
    },
    images: [
        {
            type: String, // Store service-related image URLs
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
    availability: {
        type: String,
        enum: ["Available", "Unavailable"],
        default: "Available"
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Refers to the User model (service provider)
        required: true
    },
    contactDetails: {
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true
        }
    },
    ratings: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            rating: { type: Number, min: 1, max: 5 },
            review: String,
            createdAt: { type: Date, default: Date.now }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Service", ServiceSchema);
