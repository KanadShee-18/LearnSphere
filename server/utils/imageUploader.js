const { google } = require("googleapis");
const { getAuthClient } = require("../config/drive");
const { Readable } = require("stream");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const { fs } = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "C_projects.pdf");

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
  console.log("Trying uploading");

  const options = { folder };
  if (height) {
    options.height = height;
  }
  if (quality) {
    options.quality = quality;
  }
  options.resource_type = "auto";

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      );

      stream.end(file.data);
    });

    console.log("Upload successful:", result);
    return result;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload image to Cloudinary.");
  }
};

exports.uploadPdfToDrive = async (pdfFile, folderId, authClient) => {
  console.log("pdfFile name is: ", pdfFile.name);
  console.log("pdfFile size is: ", pdfFile.size);
  console.log("pdfFile tempFilePath is: ", pdfFile.tempFilePath);
  console.log("pdfFile data is: ", pdfFile.data);
  console.log("Folder id: ", folderId);

  const bufferStream = new Readable();
  bufferStream.push(pdfFile.data);
  bufferStream.push(null);

  const fileMetadata = {
    name: pdfFile.name,
    parents: [folderId],
  };

  const media = {
    mimeType: "application/pdf",
    body: bufferStream,
  };

  const drive = google.drive({ version: "v3", auth: authClient });

  try {
    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    const fileId = file.data.id;
    console.log("Uploaded PDF file ID: ", file.data.id);
    console.log("Uploaded PDF file: ", file.data);

    // Set permissions for the uploaded file
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    return {
      fileId: file.data.id,
      message: "File Uploaded Successfully.",
    };
  } catch (error) {
    console.error("Error uploading PDF to Google Drive:", error);
    throw new Error("Failed to upload PDF.");
  }
};

exports.generatePublicUrlForPdf = async (authClient, pdfId) => {
  try {
    const drive = google.drive({ version: "v3", auth: authClient });
    await drive.permissions.create({
      fileId: pdfId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    const result = await drive.files.get({
      fileId: pdfId,
      fields: "webViewLink, webContentLink",
    });
    console.log(result.data);
    return result.data;
  } catch (error) {
    console.log("Error occurred while deleting pdf file: ", error.message);
    throw new Error(error.message);
  }
};

exports.deletePdfFileFromDrive = async (authClient, pdfId) => {
  try {
    const drive = google.drive({ version: "v3", auth: authClient });
    const deletedPdf = await drive.files.delete({
      fileId: pdfId,
    });
    console.log("Deleted PDF response: ", deletedPdf);
  } catch (error) {
    console.log("Error occurred while deleting pdf file: ", error.message);
    throw new Error(error.message);
  }
};

exports.destroyImageFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Error deleting image from Cloudinary: ${error.message}`);
  }
};

exports.destroyVideoFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });
    return result;
  } catch (error) {
    throw new Error(`Error deleting image from Cloudinary: ${error.message}`);
  }
};
