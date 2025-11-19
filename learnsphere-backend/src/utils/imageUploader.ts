import { Readable } from "stream";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { google } from "googleapis";
import type { JWT } from "google-auth-library";

interface UploadPdfResponse {
  fileId: string;
  message: string;
}

// ------------------ Cloudinary Upload ------------------
export const uploadImageToCloudinary = async (
  file: any,
  folder: string,
  height?: number,
  quality?: number
) => {
  console.log("Trying uploading");

  const options: Record<string, any> = { folder, resource_type: "auto" };
  if (height) {
    options.height = height;
  }
  if (quality) {
    options.quality = quality;
  }

  try {
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (!result) return reject(new Error("Cloudinary result is empty"));
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

// ------------------ Google Drive Upload ------------------

export const uploadPdfToDrive = async (
  pdfFile: any,
  folderId: string,
  authClient: JWT
): Promise<UploadPdfResponse> => {
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
      requestBody: fileMetadata,
      media: media,
      fields: "id",
    });

    const fileId = file.data.id ?? null;
    console.log("Uploaded PDF file ID: ", fileId);
    console.log("Uploaded PDF file: ", file.data);

    if (!fileId) {
      throw new Error("Google Drive did not return a valid file ID.");
    }

    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    return {
      fileId,
      message: "File Uploaded Successfully.",
    };
  } catch (error) {
    console.error("Error uploading PDF to Google Drive:", error);
    throw new Error("Failed to upload PDF.");
  }
};

// ------------------ Generate Public URL ------------------
export const generatePublicUrlForPdf = async (
  authClient: JWT,
  pdfId: string
) => {
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
  } catch (error: any) {
    console.log("Error occurred while deleting pdf file: ", error.message);
    throw new Error(error.message);
  }
};

// ------------------ Delete File from Drive ------------------
export const deletePdfFileFromDrive = async (
  authClient: JWT,
  pdfId: string
) => {
  try {
    const drive = google.drive({ version: "v3", auth: authClient });
    const deletedPdf = await drive.files.delete({
      fileId: pdfId,
    });
    console.log("Deleted PDF response: ", deletedPdf);
  } catch (error: any) {
    console.log("Error occurred while deleting pdf file: ", error.message);
    throw new Error(error.message);
  }
};

// ------------------ Cloudinary Delete Image ------------------
export const destroyImageFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error: any) {
    throw new Error(`Error deleting image from Cloudinary: ${error.message}`);
  }
};

// ------------------ Cloudinary Delete Video ------------------
export const destroyVideoFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });
    return result;
  } catch (error: any) {
    throw new Error(`Error deleting image from Cloudinary: ${error.message}`);
  }
};
