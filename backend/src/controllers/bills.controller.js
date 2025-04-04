import { asyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Bill } from "../models/bills.model";
import { Contract } from "../models/contract.model";

const createBill=asyncHandler(async (res,req) => {
    const {contractId}=req.params;
    const {amount,dueDate,paymentMethod}=req.body;

    if (!["cash", "bank transfer", "credit card", "UPI","any"].includes(paymentMethod)) {
        paymentMethod="any";
    }

    const contract=await Contract.findById(contractId).populate("property");

    if(!contract){
        throw new ApiError(500,"contract not found");
    }

    if(req.user._id.toString()!==contract.owner.toString()){
        throw new ApiError(401,"User Unauthorised");
    }

    const bill= await Bill.create({
        contract:contractId,
        property:contract.property._id,
        paymentMethod:paymentMethod,
        amount,
        dueDate
    });
})