// src/components/DemoRequestForm.tsx
import React from "react";

const DemoRequestForm = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-[#9b4b90]">
          Request a Demo
        </h2>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
          />
          <input
            type="tel"
            placeholder="Phone"
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 border rounded"
            rows={3}
          />
          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="bg-[#9b4b90] text-white px-4 py-2 rounded"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DemoRequestForm;
