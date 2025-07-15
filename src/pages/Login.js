import React, { useState } from "react";
import { apiService, apiServiceWithOutToken } from "../utils/apiService";
import RAILWAY_CONST from "../utils/RailwayConst";
import railImage from "../images/trainImage.png";
import logo from "../images/loginPageLogo.png";
import showPassword from "../images/eye-passwordShow.svg";
import hidePassword from "../images/eye-passwordHide.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { setDataOnLocalStorage } from "../utils/localStorage";
import ErrorPopUpComponent from "../components/ErrorPopUpComponent";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isShowPasswrod, setIsShowPasswrod] = useState(false);
  const [errorPopupState, setErrorPopupState] = useState({
    isShow: false,
    message: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and Password are required");
      return;
    }
    setError("");

    // Call API for login
    await getChartSpeedBeforeHaltData();
  };
  // const getChartSpeedBeforeHaltData = async () => {
  //   let data = {
  //     username: email,
  //     password: password,
  //   };
  //   try {
  //     const response = await apiServiceWithOutToken(
  //       "post",
  //       RAILWAY_CONST.API_ENDPOINT.LOGIN,
  //       data
  //     );
  //     const userObj = response.data;

  //     setDataOnLocalStorage("userInfo", userObj);
  //     navigate(RAILWAY_CONST.ROUTE.HOME);
  //   } catch (error) {
  //     console.error("Error fetching chart data:", error);
  //   }
  // };

  const getChartSpeedBeforeHaltData = async () => {
    let data = {
      username: email,
      password: password,
    };

    const params = new URLSearchParams(location.search);

    try {
      const response = await apiServiceWithOutToken(
        "post",
        RAILWAY_CONST.API_ENDPOINT.LOGIN,
        data
      );
      const userObj = response.data;
      console.log("userObj", userObj);
      if (response.data) {
        // userObj.access_token =
        //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0NzEyMDQ1NCwianRpIjoiZDlhZDBmYjMtYWE0My00ZGY2LWIxYmItOGI1ZWJkZTU4MDFmIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImdpcmlzaCIsIm5iZiI6MTc0NzEyMDQ1NCwiY3NyZiI6IjI1MTE4NTE5LTViMTYtNDJjMC1iYTRjLTMyNWE5OTE1YWE4MiIsImV4cCI6MTc0Nzk4NDQ1NCwidV9pZCI6IjEiLCJuYW1lIjoiR2lyaXNoIEt1bWFyIiwicm9sZSI6MSwiZGVzaWduYXRpb24iOiJUZWNoIn0.oMH-bwOglul8MLmFQJ6OxG8UbYudPELZgjAkA3ErtOs";
        setDataOnLocalStorage("userInfo", userObj);

        let accessToken = localStorage.getItem("userInfo");

        if (accessToken) {
          // accessToken = accessToken?.access_token;
          console.log("Access Token:", accessToken);
        }

        if (
          window.AndroidBridge &&
          typeof window.AndroidBridge.receiveAccessToken === "function"
        ) {
          window.AndroidBridge?.receiveAccessToken(accessToken);
        }

        if (params.get("dataCollection")) {
          navigate(RAILWAY_CONST.ROUTE.ROUTELIST); // ✅ Only redirects on success
        } else {
          navigate(RAILWAY_CONST.ROUTE.HOME); // ✅ Only redirects on success
        }
      } else {
        setErrorPopupState({
          isShow: true,
          message: response?.message,
        });
      }
    } catch (error) {
      console.error("Login error:", error);

      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";

      setErrorPopupState({
        isShow: true,
        message: errorMessage,
      });
    }
  };

  return (
    <div className="h-screen reportGenerateBg w-full flex items-center justify-center">
      <div className="flex items-center max-w-[1400px] w-full mx-auto justify-between mt-8 p-2 flex-row pt-[70px]">
        <div className="mx-[20px] loginLeft w-auto">
          <img src={railImage} alt="rail banner" className="max-w-[550px]" />
        </div>
        <div className="pr-[20px] loginRight max-w-[416px] w-full">
          <div className="bg-white p-6 rounded-[20px] shadow-lg max-w-[416px] w-full">
            <div>
              <img src={logo} alt="logo" className="max-w-[115px]" />
            </div>
            <h2 className="mt-[25px] mb-[30px]">
              <span className="text-[18px] text-[#2A235A] block">
                Get Started
              </span>
              <span className="text-[12px] text-[#696F76] block">
                Welcome to RailPlot - Let’s create your account
              </span>
            </h2>
            <hr className="mb-[30px]" />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {errorPopupState.isShow && (
              <div className="text-red-500 text-sm mt-2 text-center mb-[20px]">
                {errorPopupState.message}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-[#2D255C] text-[14px] font-medium">
                  Email
                </label>
                <input
                  type="text"
                  id="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-[#99B4CF] rounded mt-1 bg-[#F7FBFF] text-[14px]  h-[40px]"
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-1 relative">
                <label className="block text-[#2D255C] text-[14px] font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type={isShowPasswrod ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-[#99B4CF] rounded mt-1 bg-[#F7FBFF] text-[14px] h-[40px]"
                  placeholder="Enter your password"
                />

                <div>
                  {isShowPasswrod ? (
                    <span>
                      <img
                        src={hidePassword}
                        alt="hidePassword"
                        className="absolute right-[10px] top-[36px] cursor-pointer max-w-[21px]"
                        onClick={() => setIsShowPasswrod(!isShowPasswrod)}
                      />
                    </span>
                  ) : (
                    <span>
                      <img
                        src={showPassword}
                        alt="showPassword"
                        className="absolute right-[10px] top-[37px] max-w-[21px] cursor-pointer"
                        onClick={() => setIsShowPasswrod(!isShowPasswrod)}
                      />
                    </span>
                  )}
                </div>
              </div>
              <p className="mb-4 text-right cursor-pointer">
                <a
                  href={RAILWAY_CONST.ROUTE.FORGETPASSWORD}
                  className="text-[#91518D] hover:underline text-[14px] underline"
                >
                  Forgot password?
                </a>
              </p>
              <button
                type="submit"
                id="loginButton"
                className="w-full reportGenerateBg  text-white p-2 rounded hover:bg-blue-600 mt-6 mb-12 h-[46px]"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
