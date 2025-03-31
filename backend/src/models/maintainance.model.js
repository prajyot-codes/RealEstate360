import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema({
    contract: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contract",
        required: true
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["pending", "in-progress", "resolved", "rejected"],
        default: "pending"
    },
    estimatedCost: {
        type: Number
    },
    actualCost: {
        type: Number
    },
    requestedAt: {
        type: Date,
        default: Date.now
    },
    resolvedAt: {
        type: Date
    }
}, { timestamps: true });

const Maintenance = mongoose.model("Maintenance", maintenanceSchema);
export { Maintenance };
