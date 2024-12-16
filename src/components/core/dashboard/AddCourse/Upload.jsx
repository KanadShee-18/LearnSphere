import React, { useEffect, useRef, useState } from "react";
import "video-react/dist/video-react.css";
import { useDropzone } from "react-dropzone";
import { Player } from "video-react";
import { FiUploadCloud } from "react-icons/fi";

const Upload = ({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  pdf = false,
  viewData = null,
  editData = null,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(
    viewData || editData || ""
  );
  const inputRef = useRef(null);

  const previewFile = (file) => {
    const reader = new FileReader();

    if (pdf) {
      reader.readAsArrayBuffer(file); // Read PDFs as ArrayBuffer
      reader.onloadend = () => {
        const blob = new Blob([reader.result], { type: "application/pdf" });
        const blobUrl = URL.createObjectURL(blob);
        setPreviewSource(blobUrl); // Use Blob URL for iframe
      };
    } else {
      // Directly create a URL for images and videos
      setPreviewSource(URL.createObjectURL(file));
    }

    reader.onerror = () => {
      console.error("Error reading the file.");
    };
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    // console.log("File comes as: ", file);

    if (file) {
      previewFile(file);
      setSelectedFile(file);
      setValue(name, file); // Ensure you're setting the file in react-hook-form
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept:
      !video && !pdf
        ? { "image/*": [".jpeg", ".jpg", ".png"] }
        : video
        ? { "video/*": [".mp4"] }
        : pdf
        ? { "application/pdf": [".pdf"] }
        : {},
    onDrop,
  });

  useEffect(() => {
    register(name, { required: true }); // Register the input
  }, [register, name]);

  // Function to create Google Drive preview link
  const getGoogleDrivePreviewLink = (url) => {
    const fileId = url.split("/d/")[1]?.split("/")[0];
    return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : null;
  };

  // Handle viewData or editData for preview
  useEffect(() => {
    if (viewData || editData) {
      const link = viewData || editData;
      if (link.includes("drive.google.com")) {
        const previewLink = getGoogleDrivePreviewLink(link);
        setPreviewSource(previewLink);
      } else {
        setPreviewSource(link);
      }
    }
  }, [viewData, editData]);

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>
      <div
        className={`${
          isDragActive ? "bg-richblack-600" : "bg-slate-800"
        } flex min-h-[250px] cursor-pointer items-center rounded-md border-2 border-dotted border-slate-600`}
        {...getRootProps()}
      >
        <input {...getInputProps()} ref={inputRef} />
        {previewSource ? (
          <div className="flex flex-col items-center w-full p-6">
            {!video && !pdf ? (
              <img
                src={previewSource}
                alt={`Img Preview`}
                className="object-cover w-full h-full rounded-md"
              />
            ) : video ? (
              <Player aspectRatio="16:9" playsInline src={previewSource} />
            ) : pdf ? (
              <iframe
                src={previewSource}
                title="PDF Preview"
                className="w-full h-full rounded-md aspect-[3/4]"
              />
            ) : null}
            {!viewData && (
              <button
                type="button"
                onClick={() => {
                  setPreviewSource("");
                  setSelectedFile(null);
                  setValue(name, null); // Reset form value
                }}
                className="px-3 py-1 mt-3 tracking-wide rounded-md text-slate-300 bg-slate-700 hover:bg-slate-600 w-fit"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center w-full p-6">
            <div className="grid rounded-full aspect-square w-14 place-items-center bg-pure-greys-800">
              <FiUploadCloud className="text-2xl text-cyan-600" />
            </div>
            <p className="text-sm mt-2 max-w-[200px] text-center text-[#8a97d8]">
              Drag and drop{" "}
              {!video && !pdf ? "an image" : video ? "a video" : "a pdf"}, or
              click to{" "}
              <span className="font-semibold text-cyan-500">Browse</span> a file
            </p>
            <ul className="flex flex-col justify-between mt-10 space-x-0 space-y-2 text-xs text-center list-disc md:space-x-12 md:flex-row md:space-y-0 text-slate-400">
              {video && (
                <li className="list-none tracking-wide text-[#8a97d8]">
                  Aspect ratio: 16:9
                </li>
              )}
              <li className="list-none tracking-wide text-[#8a97d8]">
                {video ? "Recommended size 1024x576" : "UPLOAD PDF"}
              </li>
            </ul>
          </div>
        )}
      </div>
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required.
        </span>
      )}
    </div>
  );
};

export default Upload;
