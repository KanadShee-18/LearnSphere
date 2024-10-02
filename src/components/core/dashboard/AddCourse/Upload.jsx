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
    viewData ? viewData : editData ? editData : ""
  );
  const inputRef = useRef(null);

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      if (pdf) {
        // Create a blob URL for PDF files
        const blob = new Blob([reader.result], { type: file.type });
        const blobUrl = URL.createObjectURL(blob);
        setPreviewSource(blobUrl); // Use blob URL for iframe
      } else {
        setPreviewSource(reader.result); // For image or video preview
      }
    };
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    console.log("File comes as: ", file);

    if (file) {
      previewFile(file);
      setSelectedFile(file);
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
    register(name, { required: true });
  }, [register]);

  useEffect(() => {
    setValue(name, selectedFile);
  }, [selectedFile, setValue]);

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>
      <div
        className={`${isDragActive ? "bg-richblack-600" : "bg-richblack-700"}
      flex min-h-[250px] cursor-pointer items-center rounded-md border-2 border-dotted border-richblack-500
      `}
      >
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
                className="w-full h-full rounded-md"
              />
            ) : null}
            {!viewData && (
              <button
                type="button"
                onClick={() => {
                  setPreviewSource("");
                  setSelectedFile(null);
                  setValue(name, null);
                }}
                className="px-3 py-1 mt-3 tracking-wide rounded-md text-slate-300 bg-slate-700 hover:bg-slate-600 w-fit"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <div
            className="flex flex-col items-center w-full p-6"
            {...getRootProps()}
          >
            <input {...getInputProps()} ref={inputRef} />
            <div className="grid rounded-full aspect-square w-14 place-items-center bg-pure-greys-800">
              <FiUploadCloud className="text-2xl text-cyan-600" />
            </div>
            <p className="text-sm mt-2 max-w-[200px] text-center text-richblack-200">
              Drag and drop{" "}
              {!video && !pdf ? "an image" : video ? "a video" : "a pdf"}, or
              click to{" "}
              <span className="font-semibold text-cyan-500">Browse</span> a file
            </p>
            <ul className="flex justify-between mt-10 space-x-12 text-xs text-center list-disc text-slate-400">
              {video && <li>Aspect ratio: 16:9</li>}
              <li>{video ? "Recommended size 1024x576" : "PDF or Image"}</li>
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
