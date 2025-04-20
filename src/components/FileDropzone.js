// components/FileDropzone.js
import React from "react";
import { useDropzone } from "react-dropzone";

const FileDropzone = ({ label, onDrop, file, required = false }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <div className="mb-4 flex items-center">
      {" "}
      {/* Use flex to align label and dropzone */}
      <label className="block font-medium mb-1 mr-4 w-40 text-right">
        {" "}
        {/* Add right alignment and fixed width for label */}
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        {...getRootProps()}
        className={`p-4 border-2 border-dashed rounded cursor-pointer transition-all flex-grow ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {file ? (
          <p className="text-green-600">{file.name}</p>
        ) : (
          <p className="text-gray-500">Drag & drop or click to select a file</p>
        )}
      </div>
    </div>
  );
};

export default FileDropzone;
