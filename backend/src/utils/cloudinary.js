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
