import type { Response } from "express";
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

// Create SubSection:

export const createSubSection = async (req: AuthRequest, res: Response) => {
  try {
    // Fetch data from body
    const { sectionId, title, description } = req.body;
    // fetch video or PDF from req.files
    const file = (req.files?.video || req.files?.pdf) as
      | UploadedFile
      | UploadedFile[]
      | undefined;

    if (!file) {
      res.status(400).json({ success: false, message: "No file uploaded." });
      return;
    }

    const safeFile = file as UploadedFile | UploadedFile[];
    //@ts-ignore
    const uploadingFile: UploadedFile = Array.isArray(safeFile)
      ? safeFile[0]
      : safeFile;

    const fileType = uploadingFile.name.split(".").pop()?.toLowerCase();

    const uploadedFile = req.files;
    console.log("Uploaded file name:", uploadedFile);

    // Validate required fields
    if (!sectionId || !title || !description || !file) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    // Check if the section exists
    const findSection = await Section.findById(sectionId);
    if (!findSection) {
      return res.status(400).json({
        success: false,
        message: "No section is available with this ID.",
      });
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
      console.log("File uploading to drive is: ", file);

      if (authClient) {
        const uploadResponse = await uploadPdfToDrive(
          file,
          CONFIGS.google_drive_folder_identifier as string,
          authClient
        );
        if (!uploadResponse || !uploadResponse.fileId) {
          res.status(422).json({
            success: false,
            message: "Error occurred while uploading pdf.",
          });
          return;
        }
        pdfFileId = uploadResponse.fileId;
        console.log("Uploaded PDF details: ", uploadResponse);

        const pdfViewLinks = await generatePublicUrlForPdf(
          authClient,
          uploadResponse.fileId
        );
        console.log("Generated link for web view: ", pdfViewLinks);

        // Get the webViewLink for the PDF
        fileUrl = pdfViewLinks.webViewLink;
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Unsupported file type. Only MP4 and PDF are allowed.",
      });
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

    console.log("Updated Section is: ", updatedSection);

    // Return the updated section in the response
    return res.status(200).json({
      success: true,
      data: updatedSection,
    });
  } catch (error) {
    console.log("Error in creating sub section: ", error);
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "An unknown error occurred.",
      });
    }
    return;
  }
};

// Update Sub-section:

export const updateSubSection = async (req: AuthRequest, res: Response) => {
  try {
    // Fetch data from req body
    const { sectionId, subSectionId, title, description } = req.body;

    // Check if the sub-section is present with the given id
    const checkSubSection = await SubSection.findById(subSectionId);
    if (!checkSubSection) {
      return res.status(400).json({
        success: false,
        message: "No sub-section is available with this id.",
      });
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
          console.log("Deleted PDF: ", deletedPDF);
        }
      }
    } else {
      if (checkSubSection.publicId) {
        const publicId = checkSubSection.publicId;
        if (publicId) {
          const deletedVideo = await destroyVideoFromCloudinary(publicId);
          console.log("Deleted Video from cloudinary: ", deletedVideo);
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
          console.log("Uploaded PDF details: ", uploadResponse);

          const pdfViewLinks = await generatePublicUrlForPdf(
            authClient,
            uploadResponse.fileId
          );
          console.log("Generated link for web view: ", pdfViewLinks);

          // Get the webViewLink for the PDF
          fileUrl = pdfViewLinks.webViewLink;
          // Update videoUrl with the Google Drive view link
          checkSubSection.videoUrl = fileUrl!;
          checkSubSection.publicId = null; // No publicId for PDFs
        }
      } else {
        return res.status(400).json({
          success: false,
          message: "Only MP4 and PDF files are supported.",
        });
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
    console.log("Error in updating sub section: ", error);
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "An unknown error occurred.",
      });
    }
    return;
  }
};

// Delete sub-section:

export const deleteSubSection = async (req: AuthRequest, res: Response) => {
  try {
    // Fetch the subsection id from the params
    // console.log("Request comes to backend to delete subsection...");

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
      return res.status(400).json({
        success: false,
        message: "No sub-section is available with this id.",
      });
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
          console.log("Deleted PDF: ", deletedPDF);
        }
      }
    } else {
      if (checkSubSection.publicId) {
        const publicId = checkSubSection.publicId;
        if (publicId) {
          const deletedVideo = await destroyVideoFromCloudinary(publicId);
          console.log("Deleted Video from cloudinary: ", deletedVideo);
        }
      }
    }

    const subSection = await SubSection.findByIdAndDelete({
      _id: subSectionId,
    });
    // Validate:
    if (!subSection) {
      return res.status(400).json({
        success: false,
        message: "No sub-section is available with this id.",
      });
    }

    // Remove the deleted subsection id from the section schema also
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );

    // console.log("Updated Section after deleteing subsection: ", updatedSection);

    // return success response
    return res.status(200).json({
      success: true,
      message: "Sub-section has been deleted successfully.",
      data: updatedSection,
    });
  } catch (error) {
    console.log("Error in deleting sub section: ", error);
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "An unknown error occurred.",
      });
    }
    return;
  }
};
