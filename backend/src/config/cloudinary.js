import dotenv from "dotenv"
dotenv.config()
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});


export const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "profilepics" }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      })
      .end(buffer);
  });
};

export const CoverUplaodToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "covers" }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      })
      .end(buffer);
  });
};

export const CoverImageToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "coverimages" }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      })
      .end(buffer);
  });
};



export const uploadResourceToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { 
          folder: `campus-connect/resources/${folder}`,
          resource_type: "auto",
          allowed_formats: ["pdf", "ppt", "pptx", "doc", "docx", "txt", "png", "jpg", "jpeg"]
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      )
      .end(buffer);
  });
};

export default cloudinary;