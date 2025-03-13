import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

class CloudinarySingleton {
  constructor() {
    if (!CloudinarySingleton.instance) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      CloudinarySingleton.instance = cloudinary;
    }

    return CloudinarySingleton.instance;
  }
}

const cloudinaryInstance = new CloudinarySingleton();
export default cloudinaryInstance;
