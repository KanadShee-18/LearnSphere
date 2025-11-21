import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../types/extend-auth.js";
import { Section } from "../models/section.model.js";
import {
  deletePdfFileFromDrive,
  destroyVideoFromCloudinary,
  generatePublicUrlForPdf,
  uploadImageToCloudinary,
  uploadPdfToDrive,
} from "../utils/imageUploader.js";
import { getAuthClient } from "../configs/drive.config.js";
import { SubSection } from "../models/subSection.model.js";
import type { UploadedFile } from "express-fileupload";
import { CONFIGS } from "../configs/index.js";
import logger from "../configs/logger.js";
import { NotFoundError, ValidationError } from "../utils/error-handler.js";

// Create SubSection:

export const createSubSection = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Fetch data from body
    const { sectionId, title, description } = req.body;
    // fetch video or PDF from req.files
    const file = (req.files?.video || req.files?.pdf) as
      | UploadedFile
      | UploadedFile[]
      | undefined;

    let fileType: string | undefined;
    if (!file) {
      return next(new ValidationError("File is required."));
    } else {
      const safeFile = file as UploadedFile | UploadedFile[];
      //@ts-ignore
      const uploadingFile: UploadedFile = Array.isArray(safeFile)
        ? safeFile[0]
        : safeFile;

      fileType = uploadingFile.name.split(".").pop()?.toLowerCase();
    }

    const uploadedFile = req.files;
    logger.info("Uploaded file name:", uploadedFile);

    // Validate required fields
    if (!sectionId || !title || !description || !file) {
      return next(new ValidationError("All fields are required."));
    }

    // Check if the section exists
    const findSection = await Section.findById(sectionId);
    if (!findSection) {
      return next(new NotFoundError("No section found with this id."));
    }

    let uploadDetails;
    let fileUrl;
    let timeDuration = "N/A";
    let pdfFileId;

    // Upload video or PDF based on file type
    if (fileType === "mp4") {
      // Upload video to Cloudinary
      uploadDetails = await uploadImageToCloudinary(
        file,
        process.env.CLOUDINARY_FOLDER_NAME as string
      );
      fileUrl = uploadDetails.secure_url;
      timeDuration = `${uploadDetails.duration}`;
    } else if (fileType === "pdf") {
      // Upload PDF to Google Drive
      const authClient = getAuthClient();
      logger.info("File uploading to drive is: ", file);

      if (authClient) {
        const uploadResponse = await uploadPdfToDrive(
          file,
          CONFIGS.google_drive_folder_identifier as string,
          authClient
        );
        if (!uploadResponse || !uploadResponse.fileId) {
          return next(
            new ValidationError("Failed to upload PDF to Google Drive.")
          );
        }
        pdfFileId = uploadResponse.fileId;
        logger.info("Uploaded PDF details: ", uploadResponse);

        const pdfViewLinks = await generatePublicUrlForPdf(
          authClient,
          uploadResponse.fileId
        );
        logger.info("Generated link for web view: ", pdfViewLinks);

        // Get the webViewLink for the PDF
        fileUrl = pdfViewLinks.webViewLink;
      }
    } else {
      return next(new ValidationError("Only MP4 and PDF files are supported."));
    }

    const newSubSection = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: fileUrl,
      publicId: uploadDetails?.public_id || pdfFileId,
    });

    // Update section with the new sub-section
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subSection: newSubSection._id } },
      { new: true }
    ).populate("subSection");

    logger.info("Updated Section is: ", updatedSection);

    // Return the updated section in the response
    return res.status(200).json({
      success: true,
      data: updatedSection,
    });
  } catch (error) {
    logger.error("Error in creating sub section: ", error);
    return next(error);
  }
};

// Update Sub-section:

export const updateSubSection = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Fetch data from req body
    const { sectionId, subSectionId, title, description } = req.body;

    // Check if the sub-section is present with the given id
    const checkSubSection = await SubSection.findById(subSectionId);
    if (!checkSubSection) {
      return next(
        new NotFoundError("No sub-section is available with this id.")
      );
    }

    // If the sub-section has a previous video, delete it from Cloudinary (for MP4 files)
    if (checkSubSection.timeDuration === "N/A") {
      if (checkSubSection.publicId) {
        const drivePdfId = checkSubSection.publicId;
        const authClient = getAuthClient();
        if (authClient) {
          const deletedPDF = await deletePdfFileFromDrive(
            authClient,
            drivePdfId
          );
          logger.info("Deleted PDF: ", deletedPDF);
        }
      }
    } else {
      if (checkSubSection.publicId) {
        const publicId = checkSubSection.publicId;
        if (publicId) {
          const deletedVideo = await destroyVideoFromCloudinary(publicId);
          logger.info("Deleted Video from cloudinary: ", deletedVideo);
        }
      }
    }
    // Validate and update fields
    if (title !== undefined) {
      checkSubSection.title = title;
    }
    if (description !== undefined) {
      checkSubSection.description = description;
    }

    // If a new file is uploaded
    if (req.files && req.files.video) {
      const file = req.files.video;
      //@ts-ignore
      const fileType = file.name.split(".").pop().toLowerCase(); // Get file extension

      let uploadDetails;
      let fileUrl;
      let timeDuration = "N/A";

      // Check if the file is a video (mp4) or a PDF
      if (fileType === "mp4") {
        // Upload video to Cloudinary
        uploadDetails = await uploadImageToCloudinary(
          file,
          process.env.CLOUDINARY_FOLDER_NAME as string
        );
        fileUrl = uploadDetails.secure_url;
        timeDuration = `${uploadDetails.duration}`;

        // Update videoUrl with the Cloudinary URL
        checkSubSection.videoUrl = fileUrl;
        checkSubSection.timeDuration = timeDuration;
        checkSubSection.publicId = uploadDetails.public_id;
      } else if (fileType === "pdf") {
        // Upload PDF to Google Drive
        const authClient = getAuthClient();
        if (authClient) {
          const uploadResponse = await uploadPdfToDrive(
            file,
            CONFIGS.google_drive_folder_identifier as string,
            authClient
          );
          logger.info("Uploaded PDF details: ", uploadResponse);

          const pdfViewLinks = await generatePublicUrlForPdf(
            authClient,
            uploadResponse.fileId
          );
          logger.info("Generated link for web view: ", pdfViewLinks);

          // Get the webViewLink for the PDF
          fileUrl = pdfViewLinks.webViewLink;
          // Update videoUrl with the Google Drive view link
          checkSubSection.videoUrl = fileUrl!;
          checkSubSection.publicId = null; // No publicId for PDFs
        }
      } else {
        return next(
          new ValidationError("Only MP4 and PDF files are supported.")
        );
      }
    }

    // Save the updated sub-section
    await checkSubSection.save();

    // Fetch and return the updated section with populated sub-sections
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );

    return res.status(200).json({
      success: true,
      message: "Sub-section has been updated successfully.",
      data: updatedSection,
    });
  } catch (error) {
    logger.error("Error in updating sub section: ", error);
    return next(error);
  }
};

// Delete sub-section:

export const deleteSubSection = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Fetch the subsection id from the params
    // logger.info("Request comes to backend to delete subsection...");

    const { subSectionId, sectionId } = req.body;
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSection: subSectionId,
        },
      }
    );

    const checkSubSection = await SubSection.findById(subSectionId);
    if (!checkSubSection) {
      return next(
        new NotFoundError("No sub-section is available with this id.")
      );
    }

    if (checkSubSection.timeDuration === "N/A") {
      if (checkSubSection.publicId) {
        const drivePdfId = checkSubSection.publicId;
        const authClient = getAuthClient();
        if (authClient) {
          const deletedPDF = await deletePdfFileFromDrive(
            authClient,
            drivePdfId
          );
          logger.info("Deleted PDF: ", deletedPDF);
        }
      }
    } else {
      if (checkSubSection.publicId) {
        const publicId = checkSubSection.publicId;
        if (publicId) {
          const deletedVideo = await destroyVideoFromCloudinary(publicId);
          logger.info("Deleted Video from cloudinary: ", deletedVideo);
        }
      }
    }

    const subSection = await SubSection.findByIdAndDelete({
      _id: subSectionId,
    });
    // Validate:
    if (!subSection) {
      return next(
        new NotFoundError("No sub-section is available with this id.")
      );
    }

    // Remove the deleted subsection id from the section schema also
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );

    // logger.info("Updated Section after deleteing subsection: ", updatedSection);

    // return success response
    return res.status(200).json({
      success: true,
      message: "Sub-section has been deleted successfully.",
      data: updatedSection,
    });
  } catch (error) {
    logger.error("Error in deleting sub section: ", error);
    return next(error);
  }
};
