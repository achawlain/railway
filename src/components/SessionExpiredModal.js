// src/components/SessionExpiredModal.jsx
import React from "react";
import ReactDOM from "react-dom";

const SessionExpiredModal = ({ message, onConfirm }) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-60 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <h2 className="text-xl font-semibold mb-4">Session Expired</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <button
          className="bg-blue-600 text-white px-5 py-2 rounded"
          onClick={onConfirm}
        >
          OK
        </button>
      </div>
    </div>,
    document.body
  );
};

export default SessionExpiredModal;
