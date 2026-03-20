import React, { useState } from "react";
import hidePasswordIcon from "../images/eye-passwordHide.svg";
import showPasswordIcon from "../images/eye-passwordShow.svg";

function UserPopup({
  showUserPopup,
  setShowUserPopup,
  userFormData,
  setUserFormData,
  handleUserSubmit,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  orgList,
  fetchOrgList
}) {
  const [errors, setErrors] = useState({});

  if (!showUserPopup) return null;

  // Handle input change
  const handleUserChange = (e) => {
    setUserFormData({
      ...userFormData,
      [e.target.name]: e.target.value
    });

    // remove error while typing
    setErrors({
      ...errors,
      [e.target.name]: ""
    });
  };

  // Validation
  const validate = () => {
    let newErrors = {};

    if (!userFormData.username) newErrors.username = "Username is required";
    if (!userFormData.name) newErrors.name = "Name is required";
    if (!userFormData.email) newErrors.email = "Email is required";
    if (!userFormData.password) newErrors.password = "Password is required";

    if (!userFormData.confirm_password) {
      newErrors.confirm_password = "Confirm Password is required";
    } else if (userFormData.password !== userFormData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmitClick = () => {
    if (validate()) {
      handleUserSubmit();
    }
  };

  // Input style
  const inputClass = (field) =>
    `w-full p-2 border rounded bg-[#F7FBFF] text-[14px] h-[40px]
    ${errors[field] ? "border-red-500" : "border-[#99B4CF]"}
    focus:outline-none focus:ring-1 
    ${errors[field] ? "focus:ring-red-500" : "focus:ring-[#9b4b90]"}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">

      {/* Scrollable Popup */}
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-6">

        <h2 className="text-xl font-semibold mb-6">New User</h2>

        {/* Username */}
        <div className="mb-4">
          <label className="text-sm font-medium">
            Username <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="username"
            value={userFormData.username}
            onChange={handleUserChange}
            className={inputClass("username")}
          />
          {errors.username && (
            <p className="text-red-500 text-xs mt-1">{errors.username}</p>
          )}
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="text-sm font-medium">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={userFormData.name}
            onChange={handleUserChange}
            className={inputClass("name")}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm font-medium">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={userFormData.email}
            onChange={handleUserChange}
            className={inputClass("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="text-sm font-medium">
            Password <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={userFormData.password}
              onChange={handleUserChange}
              className={inputClass("password")}
            />

            <img
              src={showPassword ? hidePasswordIcon : showPasswordIcon}
              alt="toggle"
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer w-[20px]"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>

          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label className="text-sm font-medium">
            Confirm Password <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirm_password"
              value={userFormData.confirm_password}
              onChange={handleUserChange}
              className={inputClass("confirm_password")}
            />

            <img
              src={showConfirmPassword ? hidePasswordIcon : showPasswordIcon}
              alt="toggle"
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer w-[20px]"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            />
          </div>

          {errors.confirm_password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirm_password}
            </p>
          )}
        </div>

        {/* Designation */}
        <div className="mb-4">
          <label className="text-sm font-medium">Designation</label>
          <input
            type="text"
            name="designation"
            value={userFormData.designation}
            onChange={handleUserChange}
            className="w-full p-2 border border-[#99B4CF] rounded bg-[#F7FBFF]"
          />
        </div>

        {/* Role */}
        <div className="mb-4">
          <label className="text-sm font-medium">Role</label>
          <select
            name="role"
            value={userFormData.role}
            onChange={handleUserChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Role</option>
            <option value="0">SUPER ADMIN</option>
            <option value="1">USER</option>
            <option value="2">DATA COLLECTOR</option>
            <option value="3">ADMIN</option>
          </select>
        </div>

        {/* Organization */}
        <div className="mb-6">
          <label className="text-sm font-medium">Organization</label>
          <select
            name="organisation"
            value={userFormData.organisation}
            onChange={handleUserChange}
            onClick={fetchOrgList}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Organization</option>
            {orgList.map((org) => (
              <option key={org.id} value={org.id}>
                {org.org_name}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowUserPopup(false)}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmitClick}
            className="px-4 py-2 bg-[#9b4b90] text-white rounded"
          >
            Submit
          </button>
        </div>

      </div>
    </div>
  );
}

export default UserPopup;
