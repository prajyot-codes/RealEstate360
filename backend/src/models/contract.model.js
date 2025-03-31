import mongoose from "mongoose";

const contractSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the owner
        required: true
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the tenant
        required: true
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property", // Reference to the property
        required: true
    },
    rentAmount: {
        type: Number,
        required: true
    },
    durationMonths: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "active", "completed", "terminated"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Contract = mongoose.model("Contract", contractSchema);
export { Contract };
