import mongoose from "mongoose"

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
        enum: ["Fitness", "Business", "Education", "IT", "Photography", "others"],
        required: true
    },
    images:{
        type: String, // Store image URLs
    },
    location: {
        area:String,
        city: String,
        state: String,
        country: String
    },
    latitude: Number,
    longitude: Number,  
    price: {
        type: Number,
        required: true,
        min: 0
    },
    experience:{
        type: String,
        enum: ["Beginner", "Intermediate", "Expert"],
        required: true
    },
    duration:{
        type: String,
        enum: ["30 Minutes", "1 Hour", "2 Hours"],
        required: true
    },
    language: {
        type: [String], // This ensures it's an array of strings
        required: true,
      },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Refers to the User model (service provider)
        required: true
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

const Service = mongoose.model("Service",ServiceSchema);
export default Service;