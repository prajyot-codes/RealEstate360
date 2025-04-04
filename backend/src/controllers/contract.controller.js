import { Contract } from "../models/contract.model.js";
import { Request } from "../models/request.model.js";
import { Property } from "../models/property.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createContract = asyncHandler(async (req, res) => {
    const { requestId, startDate, endDate, rentAmount, terms } = req.body;

    if (!requestId || !startDate || !endDate || !rentAmount) {
        throw new ApiError(400, "Request ID, start date, end date, and rent amount are required");
    }

    if (!req.user || req.user.role !== "owner") {
        throw new ApiError(403, "Only owners can create contracts");
    }

    // Fetch the contract request
    const contractRequest = await Request.findById(requestId);
    if (!contractRequest || contractRequest.type !== "contract") {
        throw new ApiError(404, "Contract request not found");
    }

    if (contractRequest.status !== "pending") {
        throw new ApiError(400, "This request has already been processed");
    }

    // Ensure the owner is the correct recipient of the request
    if (contractRequest.receiver.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to create this contract");
    }

    // Fetch the property details
    const property = await Property.findById(contractRequest.property);
    if (!property) {
        throw new ApiError(404, "Property not found");
    }

    // Create the contract
    const newContract = await Contract.create({
        owner: req.user._id,
        tenant: contractRequest.sender,
        property: property._id,
        startDate,
        endDate,
        rentAmount,
        terms,
    });

    // Mark the request as "accepted"
    contractRequest.status = "accepted";
    await contractRequest.save();

    return res.status(201).json(new ApiResponse(201, newContract, "Contract created successfully"));
});



export {createContract}