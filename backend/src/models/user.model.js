import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["owner", "tenant"],
        required: true
    },
    documents: [
        {
            type: String
        }
    ], // Array of document file URLs
    coverImage: {
        type: String
    }, // URL for profile or cover image
    refreshToken: {
        type: String,
        default: null
    }, // Stores the latest refresh token
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Generate Access Token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

// Generate Refresh Token and store it in the database
userSchema.methods.generateRefreshToken = function () {
    const token = jwt.sign(
        { id: this._id, role: this.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
    this.refreshToken = token; // Store the refresh token
    return token;
};

// Check if the password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
   return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export { User};
