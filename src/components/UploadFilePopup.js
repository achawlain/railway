import { useState } from "react";

const UploadFilePopup = ({ onClose }) => {
  const [showUploadBox, setShowUploadBox] = useState(false);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✖
        </button>
        <h2 className="text-lg font-semibold mb-4">
          Please upload a file to proceed.
        </h2>
        {!showUploadBox ? (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setShowUploadBox(true)}
          >
            Upload File
          </button>
        ) : (
          <div>
            <input type="file" onChange={handleFileChange} className="mb-4" />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => {
                if (file) {
                  onClose();
                } else {
                  alert("Please select a file.");
                }
              }}
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadFilePopup;
