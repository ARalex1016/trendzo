import { v2 as cloudinary } from "cloudinary";

// Config
import { env } from "./env.config.ts";

cloudinary.config({
  cloud_name: env.CLOUDINARY_NAME,
  api_key: env.CLOUDINARY_KEY,
  api_secret: env.CLOUDINARY_SECRET,
});

export default cloudinary;
