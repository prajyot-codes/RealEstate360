import mongoose from "mongoose";
import { type } from "os";

const propertySchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type:String,
        required:true
    },
    price: {
        type: Number,
        required: true
    },
    size: {
        type: Number, // In square feet
        required: true
    },
    bedrooms: {
        type: Number,
        required: true
    },
    bathrooms: {
        type: Number,
        required: true
    },
    images: [
        {
            type: String, // Cloudinary URLs for property images
            required: false
        }
    ],
    status: {
        type: String,
        enum: ["available", "rented"],
        default: "available"
    },
    listedAt: {
        type: Date,
        default: Date.now
    }
});

// Indexing for faster searching
propertySchema.index({ title: "text", description: "text", "address.city": "text", "address.state": "text" });

const Property = mongoose.model("Property", propertySchema);
export default Property;
