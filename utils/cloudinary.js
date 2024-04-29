import {v2 as cloudinary} from 'cloudinary';
import { Console } from 'console';
import fs from "fs";
     
     


cloudinary.config({ 
  cloud_name:process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOncloudinary= async (localFilePath)=>{
    try {
        if(!localFilePath) return null
        //upload file on cloudinary

        const response= await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        //file upload message
        console.log("File has been uploaded", response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the locally saved temporary file as the upload operation got failed

        return null;
    }
}

export{uploadOncloudinary}