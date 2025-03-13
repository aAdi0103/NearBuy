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
        enum: ["Fitness & Wellness", "Business Consulting", "Online Tutoring", "IT & Software Services", "Laundry", "Other"],
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
    experience:{
        type: String,
        enum: ["30 min", "1 hour", "2 hour"],
        required: true
    },
    duration:{
        type: String,
        enum: ["Beginner", "Intermediate", "expert"],
        required: true
    },
    language:{
        type:String,
        required:true
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