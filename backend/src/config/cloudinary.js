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

export default cloudinary;