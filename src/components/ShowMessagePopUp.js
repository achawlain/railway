// components/Popup.js
import React from "react";

const ShowMessagePopUp = ({ message, type = "success", onClose }) => {
  const bgColor =
    type === "success" ? "bg-white text-green-800" : "bg-white text-red-800";
  const borderColor =
    type === "success" ? "border-green-400" : "border-red-400";

  return (
    <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 `}>
      <div
        className={`p-4 border ${borderColor} rounded shadow-md ${bgColor} min-w-[300px] flex justify-between items-center`}
      >
        <span className="mr-4">{message}</span>
        <button onClick={onClose} className="font-bold text-xl px-2">
          ×
        </button>
      </div>
    </div>
  );
};

export default ShowMessagePopUp;
