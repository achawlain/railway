import React, { useState, useRef, useEffect } from "react";
import profileImg from "../images/profileImgC.png";
import { getDataFromLocalStorage } from "../utils/localStorage";
import { apiService } from "../utils/apiService";
import RAILWAY_CONST from "../utils/RailwayConst";
import { useNavigate } from "react-router-dom";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';
import { Toast } from "primereact/toast";

const ProfileComponent = () => {
  const toastRef = useRef(null);

  const [userInfo, setUserInfo] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [email, setEmail] = useState("user@example.com");
  const [newEmail, setNewEmail] = useState("");
  const [existingPassword, setExistingPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo?.user_details?.name) {
      setNewEmail(userInfo.user_details.name);
    }
  }, []);

  const handleEmailUpdate = () => {
    if (newEmail) {
      setEmail(newEmail);
      setNewEmail("");
      alert("Email updated successfully");
    }
  };

  const handleChangePassword = async () => {
    if (!existingPassword || !newPassword) {
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please fill out both fields.",
        life: 3000,
      });
      return;
    }

    if (existingPassword === newPassword) {
      toastRef.current.show({
        severity: "warn",
        summary: "Warning",
        detail: "New password cannot be the same as the existing password.",
        life: 3000,
      });
      return;
    }


    if (!userInfo) {
      alert("User not logged in. Please log in to update your password.");
      return;
    }

    try {
      const data = {
        existing_password: existingPassword, // Match API payload keys
        new_password: newPassword,
      }


      const response = await apiService(
        "PUT",
        RAILWAY_CONST.API_ENDPOINT.CHANGEPASSWORD,
        data,
      );

      if (response.status === 200) {
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: "Password changed successfully.",
          life: 3000,
        });
        // Clear local storage and redirect to login
        localStorage.clear();
        setTimeout(() => {
          localStorage.clear();
          navigate("/login");
        }, 3000); // Delay navigation to match the toast's display time

        setExistingPassword("");
        setNewPassword("");
      } else {
        const errorMessage = response?.message || "Failed to change password";
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: errorMessage,
          life: 3000,
        });
      }
    } catch (error) {
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.message || "An error occurred while changing password.",
        life: 3000,
      });
    }
  };




  useEffect(() => {
    const user = getDataFromLocalStorage("userInfo");
    setUserInfo(user);
  }, []);



  return (
    <>
      <Toast ref={toastRef} position="top-right" />

      <div className="min-h-[calc(100vh-80px)] reportGenerateBg flex items-center justify-center p-6">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-[800px] pb-12">
          <h2 className="text-2xl font-semibold text-center mb-12 mt-4 ">
            User Profile
          </h2>
          <div className="profileContainer flex flex-row">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center mb-6 min-w-[280px]">
              <div className="w-32 h-32 rounded-full shadow-lg mb-3">
                <img
                  src={profileImg}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                {userInfo?.user_details?.name && (
                  <h3 className="text-[#9b4b90] w-full text-center mt-[15px] text-[20px] font-semibold">
                    {userInfo.user_details.name}
                  </h3>
                )}
              </div>
              {/* <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="px-4 py-2 reportGenerateBg text-white rounded"
          >
            Upload New Image
          </button> */}
            </div>

            <div className="profileRightCol">
              {/* Email Update */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2"> User Name</h3>
                {/* <p className="mb-1">
                Current User Name:{" "}
                <strong>{userInfo?.user_details?.name}</strong>
              </p> */}
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email"
                  className="w-full px-4 py-2 border rounded mb-2 bg-[#f1f1f1] pointer-events-none text=[#777]"
                  readOnly
                />
                {/* <button
                onClick={handleEmailUpdate}
                className="reportGenerateBg text-white px-4 py-2 rounded mt-2"
              >
                Update User Name
              </button> */}
              </div>

              {/* Change Password */}
              <div>
                <h3 className="text-lg font-medium mb-2">Change Password</h3>
                <input
                  type="password"
                  value={existingPassword}
                  onChange={(e) => setExistingPassword(e.target.value)}
                  placeholder="Existing Password"
                  className="w-full px-4 py-2 border rounded mb-2"
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="w-full px-4 py-2 border rounded mb-2"
                />
                <button
                  onClick={handleChangePassword}
                  className="reportGenerateBg text-white px-4 py-2 rounded mt-2"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileComponent;
