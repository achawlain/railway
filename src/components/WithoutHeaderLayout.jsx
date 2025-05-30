import React, { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import { Link, useNavigate } from "react-router-dom";

import RAILWAY_CONST from "../utils/RailwayConst"
import logoRail from "../../src/images/logo.png";
import RailPulsLogoText from "../../src/images/railpulsLogo-Top.png";
import railpulsLogo from "../../src/images/railpulsLogo.png";
import RailPulseTextLogo from "../../src/images/RailPulseTextLogo.png";
import { getDataFromLocalStorage } from "../utils/localStorage";


const WithoutHeaderLayout = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [logo, setLogo] = useState("");

  useEffect(() => {
    const user = getDataFromLocalStorage("userInfo");
    console.log("user", user);
   
    setUserInfo(user);
  }, []);
  
  return (
    <div>
       <header className="headerRow top-0 z-20 fixed bg-white w-full flex justify-between items-center px-4 shadow-md">
      <div className="max-w-[1300px] mx-auto flex flex-row justify-between w-full">
        {/* Logo */}
        <div className="h-[90px] logoHeader">
              <Link
                className="text-center"
                to={
                  userInfo ? RAILWAY_CONST.ROUTE.HOME : RAILWAY_CONST.ROUTE.HOME
                }
              >
                <span className="flex justify-center">
                  <img
                    src={railpulsLogo}
                    alt="logo"
                    className={userInfo ? "logo" : "w-[85px]"}
                  />
                </span>

                {userInfo ? (
                  <span className="flex flex-row justify-center items-center">
                    <span className="text-[16px] ml-2 font-semibold flex flex-col logoText">
                      EASTERN RAILWAY, ASANSOL DIVISION
                      <span className="text-[12px] font-normal">
                        Ministry of Railways, Govt of India.
                      </span>
                    </span>
                  </span>
                ) : (
                  <img
                    src={RailPulseTextLogo}
                    alt="logo"
                    className="w-[150px] mt-[8px]"
                  />
                )}
              </Link>
            </div>
       
      </div>
    </header>
      <Outlet />
      <div className="fixed bottom0 z-20 w-full">
      <Footer />
      </div>
    </div>
  );
};

export default WithoutHeaderLayout;
