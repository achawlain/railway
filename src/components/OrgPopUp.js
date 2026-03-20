import React, { useState } from "react";

function OrgPopup({ showPopup, setShowPopup, formData, setFormData, handleSubmit }) {

  const [errors, setErrors] = useState({});

  if (!showPopup) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    // remove error when typing
    setErrors({
      ...errors,
      [e.target.name]: ""
    });
  };

  const onSubmit = () => {
    let newErrors = {};

    if (!formData.org_name) newErrors.org_name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      handleSubmit();
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">

        <div className="bg-white p-8 rounded-xl shadow-lg w-96">

          <h2 className="text-xl font-semibold mb-4">
            New Organization
          </h2>

          {/* Name */}
          <label className="block mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="org_name"
            value={formData.org_name}
            onChange={handleChange}
            className={`w-full border p-2 mb-1 rounded ${errors.org_name ? "border-red-500" : ""}`}
          />
          {errors.org_name && (
            <p className="text-red-500 text-sm mb-2">{errors.org_name}</p>
          )}

          {/* Email */}
          <label className="block mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full border p-2 mb-1 rounded ${errors.email ? "border-red-500" : ""}`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mb-2">{errors.email}</p>
          )}

          {/* Phone */}
          <label className="block mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full border p-2 mb-1 rounded ${errors.phone ? "border-red-500" : ""}`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mb-2">{errors.phone}</p>
          )}

          {/* Address */}
          <label className="block mb-1">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={`w-full border p-2 mb-1 rounded ${errors.address ? "border-red-500" : ""}`}
          />
          {errors.address && (
            <p className="text-red-500 text-sm mb-3">{errors.address}</p>
          )}

          <div className="flex justify-end gap-3 mt-3">
            <button
              onClick={() => setShowPopup(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>

            <button
              onClick={onSubmit}
              className="px-4 py-2 bg-[#9b4b90] text-white rounded"
            >
              Submit
            </button>
          </div>

        </div>

      </div>
    </>
  );
}

export default OrgPopup;