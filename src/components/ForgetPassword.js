import React, { useState, useRef } from "react";
import { apiService, apiServiceWithOutToken } from "../utils/apiService";
import RAILWAY_CONST from "../utils/RailwayConst";
import { Link, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import leftArrow from "../images/forgotLeftArrow.svg";
import forgotPasswordIcon from "../images/forgotPasswordIcon.svg";
import resetPassword from "../images/resetPassword.svg";

export default function ForgetPassword() {
  const toastRef = useRef(null);

  const [email, setEmail] = useState("");
  // const [error, setError] = useState("");
  const [uuid, setUuid] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  // const [errorPopupState, setErrorPopupState] = useState({
  //     isShow: false,
  //     message: "",
  // });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      // setError("Email is required");
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Email is required",
        life: 3000,
      });
      return;
    }
    // setError("");
    if (uuid) {
      handleResetPassword(e);
      return;
    }
    getOTP();
    // Call API for login
  };

  const getOTP = async () => {
    let data = {
      email: email,
    };
    try {
      const response = await apiServiceWithOutToken(
        "put",
        RAILWAY_CONST.API_ENDPOINT.FORGETPASSWORD,
        data
      );
      if (response?.status === 200) {
        setUuid(response?.data.uuid);
        // setErrorPopupState({
        //     isShow: true,
        //     message: response?.message,
        // });
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: response?.message || "OTP sent successfully",
          life: 3000,
        });
      } else {
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: response?.message,
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
      // setErrorPopupState({
      //     isShow: true,
      //     message: error.response?.data?.message || "An error occurred",
      // });
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.message || "An error occurred",
        life: 3000,
      });
    }
  };

  const handleResetPassword = async (e) => {
    let data = {
      uuid: uuid,
      new_password: newPassword,
      confirm_password: confirmPassword,
      code: parseInt(otp, 10),
    };
    e.preventDefault();
    if (!newPassword || !confirmPassword || !otp) {
      // setError("All fields are required");
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "All fields are required",
        life: 3000,
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      // setError("Passwords do not match");
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "New password and confirm password do not match",
        life: 3000,
      });
      return;
    }
    try {
      const response = await apiServiceWithOutToken(
        "put",
        RAILWAY_CONST.API_ENDPOINT.RESET_PASSWORD,
        data
      );

      if (response?.status === 200) {
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: response?.message || "Password reset successfully",
          life: 3000,
        });
        setTimeout(() => {
          navigate(RAILWAY_CONST.ROUTE.LOGIN);
          setUuid("");
        }, 2000);
        // setError('');
        setNewPassword("");
        setConfirmPassword("");
        setOtp("");
        setEmail("");
        // setErrorPopupState({
        //     isShow: false,
        //     message: "",
        // });
      } else {
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: response?.message,
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      // setErrorPopupState({
      //     isShow: true,
      //     message: error.response?.message || "An error occurred",
      // });
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.message || "An error occurred",
        life: 3000,
      });
    }
  };

  return (
    <>
      <Toast ref={toastRef} position="top-right" />
      <div className="flex items-center justify-center h-screen reportGenerateBg mt-8 p-2">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          {uuid ? (
            <div className="w-full text-center flex justify-center mb-4 mt-4">
              <img src={resetPassword} alt="forgotPassword icon" />
            </div>
          ) : (
            <div className="w-full text-center flex justify-center mb-4 mt-4">
              <img src={forgotPasswordIcon} alt="forgotPassword icon" />
            </div>
          )}
          <h2 className="text-2xl font-semibold text-[#211A4C] mb-4 text-center">
            {uuid ? "Reset Password" : "Forget Password"}
            {!uuid && (
              <div className="text-[#797979] text-[13px] w-full text-center font-normal">
                No worries, we’ll send you reset instructions.{" "}
              </div>
            )}
          </h2>
          {/* {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    {errorPopupState.isShow && (
                        <div className="text-red-500 text-sm mt-2 text-center mb-[20px]">
                            {errorPopupState.message}
                        </div>
                    )} */}
          <form onSubmit={handleSubmit}>
            {uuid ? (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium text-[14px]">
                    OTP
                  </label>
                  <input
                    id="otp"
                    type="password"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-2 border rounded mt-1  text-[14px]"
                    placeholder="Enter your OTP"
                    maxLength={6}
                    minLength={6}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium  text-[14px]">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 border rounded mt-1  text-[14px]"
                    placeholder="Enter your new password"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium  text-[14px]">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 border rounded mt-1  text-[14px]"
                    placeholder="Confirm your new password"
                  />
                </div>
              </>
            ) : (
              <div className="mb-8">
                <label className="block text-[#211A4C] font-medium text-[14px]">
                  Email
                </label>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded mt-1 text-[14px]"
                  placeholder="Enter your email"
                />
              </div>
            )}

            <button
              id="getOtpButton"
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded mb-4 reportGenerateBg"
            >
              {uuid ? "Reset Password" : "Get OTP"}
            </button>
          </form>
          {!uuid && (
            <div className="w-full text-center">
              <Link to="/login" className="inline-block">
                <span class="flex flex-row justify-center items-center text-[14px] mt-4 mb-8 text-[#797979] cursor-pointer hover:text-[#414141]">
                  <span className="mr-2">
                    <img src={leftArrow} alt="arrow" />
                  </span>{" "}
                  Back to log in
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
