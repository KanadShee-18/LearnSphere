const { getAuthClient } = require("../config/drive");
const Section = require("../models/Section");
const fs = require("fs");
const SubSection = require("../models/SubSection");
const {
  uploadImageToCloudinary,
  destroyVideoFromCloudinary,
  uploadPdfToDrive,
  generatePublicUrlForPdf,
} = require("../utils/imageUploader");

// Create SubSection:

exports.createSubSection = async (req, res) => {
  try {
    // Fetch data from body
    const { sectionId, title, description } = req.body;
    // fetch video or PDF from req.files
    const file = req.files.video || req.files.pdf; // Handle both video and PDF
    const fileType = file.name.split(".").pop().toLowerCase(); // Get file extension

    const uploadedFile = req.files; // 'file' should match your input name
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
    let fileUrl; // Change from videoUrl to fileUrl for clarity
    let timeDuration = "N/A"; // Default value for PDFs

    // Upload video or PDF based on file type
    if (fileType === "mp4") {
      // Upload video to Cloudinary
      uploadDetails = await uploadImageToCloudinary(
        file,
        process.env.CLOUDINARY_FOLDER_NAME
      );
      fileUrl = uploadDetails.secure_url; // Video URL from Cloudinary
      timeDuration = `${uploadDetails.duration}`; // Duration for video
    } else if (fileType === "pdf") {
      // Upload PDF to Google Drive
      const authClient = getAuthClient();
      console.log("File uploading to drive is: ", file);

      const uploadResponse = await uploadPdfToDrive(
        file,
        process.env.GOOGLE_DRIVE_FOLDER,
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
    } else {
      return res.status(400).json({
        success: false,
        message: "Unsupported file type. Only MP4 and PDF are allowed.",
      });
    }

    // Create new sub-section with the video or PDF URL
    const newSubSection = await SubSection.create({
      title: title,
      timeDuration: timeDuration, // Use video duration if applicable, "N/A" for PDFs
      description: description,
      videoUrl: fileUrl, // Save either video or PDF URL
      publicId: uploadDetails?.public_id || null, // Only for video uploads, null for PDFs
    });

    // Update section with the new sub-section
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subSection: newSubSection._id } },
      { new: true }
    ).populate("subSection");

    // Return the updated section in the response
    return res.status(200).json({
      success: true,
      data: updatedSection,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
      message: "Some error occurred while creating the sub-section",
    });
  }
};

// Update Sub-section:

exports.updateSubSection = async (req, res) => {
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
    const publicId = checkSubSection.publicId;
    if (publicId) {
      await destroyVideoFromCloudinary(publicId);
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
      const fileType = file.name.split(".").pop().toLowerCase(); // Get file extension

      let uploadDetails;

      // Check if the file is a video (mp4) or a PDF
      if (fileType === "mp4") {
        // Upload video to Cloudinary
        uploadDetails = await uploadImageToCloudinary(
          file,
          process.env.CLOUDINARY_FOLDER_NAME
        );
        // Update videoUrl with the Cloudinary URL
        checkSubSection.videoUrl = uploadDetails.secure_url;
        checkSubSection.timeDuration = `${uploadDetails.duration}`;
        checkSubSection.publicId = uploadDetails.public_id;
      } else if (fileType === "pdf") {
        // Upload PDF to Google Drive
        const authClient = getAuthClient();
        uploadDetails = await uploadPdfToDrive(
          file,
          process.env.GOOGLE_DRIVE_FOLDER,
          authClient
        );
        // Update videoUrl with the Google Drive view link
        checkSubSection.videoUrl = `https://drive.google.com/file/d/${uploadDetails.fileId}/view`;
        checkSubSection.publicId = null; // No publicId for PDFs
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
    res.status(500).json({
      error: error.message,
      success: false,
      message: "Some error occurred while updating the sub-section.",
    });
  }
};

// Delete sub-section:

exports.deleteSubSection = async (req, res) => {
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
    return res.status(500).json({
      error: error.message,
      success: false,
      messgae: "Some error occurred while deleting the sub-section.",
    });
  }
};
