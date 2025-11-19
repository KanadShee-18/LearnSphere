import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../types/extend-auth.js";
import type { UploadedFile } from "express-fileupload";
import logger from "../configs/logger.js";

export const fileUploadAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.files && req.files.displayPicture) {
      let image = req.files.displayPicture as UploadedFile;

      const maxFileSize = 1 * 1024 * 1024;

      if (image.size > maxFileSize) {
        res.status(400).json({
          success: false,
          message: "File size exceeds! Size should be less than 1 MB",
        });
        return;
      }
      req.images = image;
      logger.info("Passed from file upload auth...");
    }
    next();
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred while checking file size.",
      error: error.message,
    });
  }
};
