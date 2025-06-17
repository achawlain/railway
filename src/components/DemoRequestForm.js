// src/components/DemoRequestForm.tsx
import React, { useState, useEffect, useRef } from "react";
import { apiService } from "../utils/apiService";
import RAILWAY_CONST from "../utils/RailwayConst";
import { Toast } from 'primereact/toast';





const DemoRequestForm = ({ onClose }) => {
  const toastRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact_num: "",
    message: "",
  });

  // Escape key handler
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleShowDemoForm = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    const { name, email } = formData;
    if (!name || !email) {
      setStatusMessage("Name and email are required.");
      return;
    }

    if (!validateEmail(email)) {
      setStatusMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    const formPayload = new FormData();
    for (let key in formData) {
      formPayload.append(key, formData[key]);
    }

    try {
      const response = await apiService("POST", RAILWAY_CONST.API_ENDPOINT.CONTACT_US, formPayload);

      if (response.status !== 200) {
        throw new Error("Submission failed");
      }

      // setStatusMessage("🎉 Demo request submitted successfully!");
      toastRef.current.show({ severity: 'success', summary: 'Success', detail: 'Demo request submitted successfully!', life: 3000 });
      setTimeout(() => {
        onClose();
      }, 3200);
      setFormData({ name: "", email: "", contact_num: "", message: "" });
      // Close the form after successful submission
    } catch (error) {
      console.error("Error submitting form:", error);
      // setStatusMessage("❌ Something went wrong. Please try again.");
      toastRef.current.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong. Please try again.', life: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast ref={toastRef} position="top-right" />

      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg"
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold mb-4 text-[#9b4b90]">
            Request a Demo
          </h2>

          <form className="space-y-4" onSubmit={handleShowDemoForm}>
            <input
              type="text"
              name="name"
              value={formData.name}
              placeholder="Name *"
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Email *"
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="tel"
              name="contact_num"
              value={formData.contact_num}
              placeholder="Phone"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <textarea
              name="message"
              value={formData.message}
              placeholder="Message"
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={3}
            />

            {statusMessage && (
              <p className="text-sm text-center text-red-500">{statusMessage}</p>
            )}

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
                disabled={loading}
                className="bg-[#9b4b90] text-white px-4 py-2 rounded"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default DemoRequestForm;
