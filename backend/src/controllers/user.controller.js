import {asyncHandler} from "../utils/AsyncHandler.js"; // Ensure correct import
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {
   console.log(req.body);
    const {name,email,password,role}=req.body;


    if ([name,email,password,role].some((field)=>
        field?.trim() === "")){
            throw new ApiError(400,"all fields are required")
        }

    const existed_user=User.findOne({
        $or:[{username},{email}]
    })

    if(existed_user){
        throw new ApiError(409,"User with username or email exist")
    }

    const user=await User.create({
        name,
        email,
        password,
        role
    })

   const createdUser= await User.findById(user._id).select(
    "-password -refreshToken"
   );

   if (!createdUser) {
    throw new ApiError(500,"something went wrong");
   }
    

   return res.status(201).json(
    new ApiResponse(200,"user Registered Successesfully")
   )
});

export { registerUser };
