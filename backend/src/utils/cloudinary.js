import {v2 as cloudinary} from "cloudinary";
import fs from "fs";


const uploadOnCloudinary= async(localfilepath) => {
    try {
        if(!localfilepath) return null;
        const response=await cloudinary.uploader.upload(localfilepath,{
            resource_type:'auto',
        })

        //file has been uploaded succesfully
        console.log('File is uploaded on the cloudinary' , response.url)
        fs.unlinkSync(localfilepath)
        return response;
    } catch (error) {
        fs.unlinkSync(localfilepath) 
        return null;
    }
}

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret:CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});


const uploadMultipleFilesOnCloudinary = async (filePaths) => {
    try {
        // Validate input
        if (!Array.isArray(filePaths) || filePaths.length === 0) {
            throw new Error("No files provided for upload.");
        }
  
        // Use the existing `uploadOnCloudinary` for each file
        const uploadPromises = filePaths.map((path) => uploadOnCloudinary(path));
  
        // Wait for all uploads to complete
        const responses = await Promise.all(uploadPromises);
  
        // Filter out any null responses (if `uploadOnCloudinary` returns null for failed uploads)
        const successfulUploads = responses.filter((res) => res !== null);
  
        // If no uploads succeeded, throw an error
        if (successfulUploads.length === 0) {
            throw new Error("All file uploads failed.");
        }
  
        // Return successful uploads
        return successfulUploads;
  
    } catch (error) {
        // Log and propagate the error for the caller
        console.error(`Error in uploadMultipleFiles: ${error.message}`);
        throw error;
    }
  };