
import mongoose from "mongoose";
import logger from "../utils/logger.js";


export async function dbConnect() {
    try {
        await mongoose.connect(process.env.url)
        logger.info("database connected");
    } catch (error) {
          logger.error(error);
    }
}