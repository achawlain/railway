import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

export default function BulkUpload ({ visible, onClose, onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    validateFile(file);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    validateFile(file);
  };

  const validateFile = (file) => {
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
      setErrorMessage("");
    } else {
      setErrorMessage("Only .csv files are allowed.");
      setSelectedFile(null);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      onClose();
    }
  };

  useEffect(() => {
    if (!visible) {
      setSelectedFile(null); // Reset file state when popup is closed
    }
  }, [visible]);

  return (
    <Dialog
      visible={visible}
      onHide={onClose}
      header="Bulk Upload"
      style={{ width: "400px" }}
      footer={
        <div className="flex justify-end gap-4">
          <Button label="Cancel" onClick={onClose} className="p-button-text px-4 py-2 border-black border border-solid outline-none" />
          <Button label="Upload" onClick={handleUpload} disabled={!selectedFile} className="bg-[#9b4b90] text-white px-4 py-2 rounded" />
        </div>
      }
    >
      <div
        onDrop={handleFileDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-dashed border-2 border-gray-300 rounded-lg p-4 text-center cursor-pointer"
        style={{ minHeight: "150px" }}
      >
        {selectedFile ? (
          <p className="text-green-500">File Selected: {selectedFile.name}</p>
        ) : (
          <p className="text-gray-500">Drag and drop a .csv file here, or click to select.</p>
        )}
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          id="fileInput"
        />
        <label htmlFor="fileInput" className="text-blue-500 underline cursor-pointer">
          Browse files
        </label>
      </div>
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
    </Dialog>
  );
};

