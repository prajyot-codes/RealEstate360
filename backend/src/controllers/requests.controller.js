import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Request from "../models/request.model.js";
import Property from "../models/property.model.js";
import User from "../models/user.model.js";

// Tenant can create a request for a contract, bill, or maintenance
export const createContractRequest = asyncHandler(async (req, res) => {
    const { propertyId, details } = req.body;

    if (!propertyId) {
        throw new ApiError(400, "Property ID is required");
    }

    if (!req.user || req.user.role !== "tenant") {
        throw new ApiError(401, "Only tenants can create contract requests");
    }

    // Check if the property exists
    const property = await Property.findById(propertyId);
    if (!property) {
        throw new ApiError(404, "Property not found");
    }

    // Get the owner of the property
    const owner = await User.findById(property.owner);
    if (!owner) {
        throw new ApiError(404, "Owner not found for this property");
    }

    // Check if a pending contract request already exists
    const existingRequest = await Request.findOne({
        sender: req.user._id,
        receiver: owner._id,
        property: propertyId,
        type: "contract",
        status: "pending",
    });

    if (existingRequest) {
        throw new ApiError(400, "You already have a pending contract request for this property");
    }

    // Create the contract request
    const newRequest = await Request.create({
        sender: req.user._id,
        receiver: owner._id,
        property: propertyId,
        type: "contract",
        details,
    });

    return res.status(201).json(new ApiResponse(201, newRequest, "Contract request sent successfully"));
});



const getSentRequests = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "User not logged in");
    }

    const userId = req.user._id;

    // Fetch requests where the user is the sender
    const sentRequests = await Request.find({ sender: userId })
        .populate("receiver property", "name title"); // Populate receiver name & property title

    return res.status(200).json(new ApiResponse(200, sentRequests, "Sent requests fetched successfully"));
});


const getReceivedRequests = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "User not logged in");
    }

    const userId = req.user._id;

    // Fetch requests where the user is the receiver
    const receivedRequests = await Request.find({ receiver: userId })
        .populate("sender property", "name title"); // Populate sender name & property title

    return res.status(200).json(new ApiResponse(200, receivedRequests, "Received requests fetched successfully"));
});


export {getReceivedRequests,getSentRequests,createContractRequest}