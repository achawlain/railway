// components/FileDropzone.js
import React from "react";
import { useDropzone } from "react-dropzone";

const FileDropzone = ({ label, onDrop, file, required = false }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <div className="mb-4">
      <label className="block font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        {...getRootProps()}
        className={`p-4 border-2 border-dashed rounded cursor-pointer transition-all ${
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
