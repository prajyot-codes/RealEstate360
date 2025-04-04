import { Property } from "../models/property.model.js"
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";  
import { ApiResponse } from "../utils/ApiResponse.js";
import { Property } from "../models/property.model.js"; 

const createProperty = asyncHandler(async (req, res) => {
    const { title, description, address, price, size, bedrooms, bathrooms, images } = req.body;

    if (!title || !description || !address || !price || !size || !bedrooms || !bathrooms) {
        throw new ApiError(400, "All fields are required");
    }

    if (!req.user) {
        throw new ApiError(401, "User not logged in");
    }

    if (req.user.role !== "owner") {
        throw new ApiError(403, "Unauthorized user");
    }

    const ownerId = req.user._id;

    const existingProperty = await Property.findOne({ title, owner: ownerId });

    if (existingProperty) {
        throw new ApiError(400, "You already have a property with this title");
    }

    const property = await Property.create({
        title,
        description,
        address,
        price,
        size,
        bedrooms,
        bathrooms,
        images,
        owner: ownerId
    });

    return res.status(201).json(new ApiResponse(201, property, "Property created successfully"));
});


const getOwnerProperties = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "User not logged in");
    }

    if (req.user.role !== "owner") {
        throw new ApiError(403, "Unauthorized user");
    }

    const ownerId = req.user._id;
    const properties = await Property.find({ owner: ownerId });

    return res.status(200).json(new ApiResponse(200, properties, "Properties retrieved successfully"));
});


const getAllProperties=asyncHandler(async (res,req) => {
    const properties= await Property.find();
    
    if(!properties){
        throw new ApiError(500,"Error while fetching the prooperties");
    }

    return res.status(200).json(new ApiResponse(200,"Properties fetched successfully"))
})

export {createProperty,getOwnerProperties,getAllProperties};
