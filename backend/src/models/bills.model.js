import mongoose from "mongoose";


const billSchema = new mongoose.Schema({
    contract: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contract", 
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
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
    amount: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["unpaid", "paid", "overdue"],
        default: "unpaid"
    },
    paymentDate: {
        type: Date
    },
    paymentMethod: {
        type: String,
        enum: ["cash", "bank transfer", "credit card", "UPI"],
        default: "bank transfer"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Bill = mongoose.model("Bill", billSchema);
export { Bill };
