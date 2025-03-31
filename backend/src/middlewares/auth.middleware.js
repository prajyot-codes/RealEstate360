import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.split(" ")[1];

        console.log("Extracted Token:", token); // ✅ Log the token

        if (!token) {
            throw new ApiError(401, "Unauthorized user - No token provided");
        }

        const decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        const user = await User.findById(decodedUser?.id).select("-password -refreshToken");
        
        if (!user) {
            console.warn("⚠️ User not found in DB for token:", decodedUser.id);
            throw new ApiError(401, "Invalid Access Token - User does not exist");
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error); // ✅ Log full error
        next(new ApiError(401, error.message || "Invalid access token"));
    }
});

