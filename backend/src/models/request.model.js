import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property", // The property related to the request
        required: true,
    },
    type: {
        type: String,
        enum: ["contract", "bill", "maintenance"], // Type of request
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    details: {
        type: String, // Any additional message/details about the request
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Request = mongoose.model("Request", requestSchema);
export default Request;
