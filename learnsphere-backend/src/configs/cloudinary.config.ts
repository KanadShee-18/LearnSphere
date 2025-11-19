import { v2 as cloudinary, type ConfigOptions } from "cloudinary";
import { CONFIGS } from "./index.js";
import logger from "./logger.js";

export const connectCloudinary = (): void => {
  try {
    cloudinary.config({
      cloud_name: CONFIGS.cloudinary_cloud as string,
      api_key: CONFIGS.cloudinary_api_key as string,
      api_secret: CONFIGS.cloudinary_api_secret as string,
    } satisfies ConfigOptions);
    logger.info("Cloudinary set up successfully ...");
  } catch (error) {
    logger.error("Cloudinary Connection Error: ", error);
  }
};
