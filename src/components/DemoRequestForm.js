// src/components/DemoRequestForm.tsx
import React, { useState } from "react";
import { apiService } from "../utils/apiService";
import RAILWAY_CONST from "../utils/RailwayConst";




const DemoRequestForm = ({ onClose }) => {

  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact_num: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleShowDemoForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formPayload = new FormData();
    formPayload.append("name", formData.name);
    formPayload.append("email", formData.email);
    formPayload.append("contact_num", formData.contact_num);
    formPayload.append("message", formData.message);

    try {
      const response = await apiService(
        "POST",
        RAILWAY_CONST.API_ENDPOINT.CONTACT_US,
        formPayload,
        
      );
      if (response.status !== 200) {
        throw new Error("Failed to submit demo request");
      }
      // alert("Demo request submitted successfully!");
      onClose(); // Close the modal after successful submission
      console.log("res", response);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
    setLoading(false);

  };
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
            value={formData.name}
            name="name"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            name="email"
            className="w-full p-2 border rounded"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={formData.contact_num}
            onChange={handleChange}
            name="contact_num"
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Description"
            value={formData.message}
            onChange={handleChange}
            name="message"
            className="w-full p-2 border rounded"
            rows={3}
          />
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 mr-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#9b4b90] text-white px-4 py-2 rounded"
              onClick={handleShowDemoForm}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DemoRequestForm;
