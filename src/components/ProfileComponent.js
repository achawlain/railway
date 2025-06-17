import React, { useState, useRef, useEffect } from "react";
import profileImg from "../images/profileImgC.png";
import { getDataFromLocalStorage } from "../utils/localStorage";

const ProfileComponent = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [email, setEmail] = useState("user@example.com");
  const [newEmail, setNewEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

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

  const handleChangePassword = () => {
    if (oldPassword && newPassword) {
      alert("Password changed successfully");
      setOldPassword("");
      setNewPassword("");
    }
  };

  useEffect(() => {
    const user = getDataFromLocalStorage("userInfo");
    setUserInfo(user);
  }, []);

  console.log("userInfo", userInfo);

  return (
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
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Old Password"
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
  );
};

export default ProfileComponent;
