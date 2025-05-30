import React, { useState, useEffect, useRef } from "react";
import logoRail from "../../src/images/logo.png";
import RailPulsLogoText from "../../src/images/railpulsLogo-Top.png";
import railpulsLogo from "../../src/images/railpulsLogo.png";
import RailPulseTextLogo from "../../src/images/RailPulseTextLogo.png";
import RAILWAY_CONST from "../utils/RailwayConst";
import { Link, useNavigate } from "react-router-dom";
import userIcon from "../../src/images/user.svg";
import { getDataFromLocalStorage } from "../utils/localStorage";
import { useLocation } from "react-router-dom";
import navIcon from "../../src/images/navIcon.svg";
import navCloseIcon from "../../src/images/closeIcon.svg";

const Header = () => {
  const location = useLocation();
  const [logo, setLogo] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isNavListVisible, setIsNavListVisible] = useState(false);
  const [isUserInfoVisible, setIsUserInfoVisible] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const navListRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 788);
      if (window.innerWidth >= 788) {
        setIsNavListVisible(false);
        setIsUserInfoVisible(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (location.pathname.includes("admin")) {
      setIsAdminRoute(true);
    } else {
      setIsAdminRoute(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const user = getDataFromLocalStorage("userInfo");
    console.log("user", user);
    if (user) {
      if (user.user_details.org_id == "1") {
        setLogo(logoRail);
      }
    } else {
      setLogo(RailPulsLogoText);
    }
    setUserInfo(user);
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleNavList = () => {
    setIsNavListVisible((prev) => !prev);
    setIsUserInfoVisible(false);
  };

  const toggleUserInfo = () => {
    setIsUserInfoVisible((prev) => !prev);
    setIsNavListVisible(false);
  };

  // const handleClickOutside = (event) => {
  //   if (navListRef.current && !navListRef.current.contains(event.target)) {
  //     setIsNavListVisible(false);
  //   }
  // };

  const handleClickOutside = (event) => {
    if (
      navListRef.current &&
      !navListRef.current.contains(event.target) &&
      !event.target.closest(".navIcon") // Prevent closing when clicking on the nav icon
    ) {
      setIsNavListVisible(false);
    }
  };

  useEffect(() => {
    if (isNavListVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNavListVisible]);

  return (
    <div>
      <>
        <header className="headerRow top-0 z-40 fixed bg-white w-full flex justify-between items-center px-4 shadow-md">
          <div className="max-w-[1300px] mx-auto flex flex-row justify-between w-full items-center">
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

            <div className="flex flex-row items-center">
              <nav className="relative" ref={navListRef}>
                <span
                  className="navIcon cursor-pointer"
                  onClick={toggleNavList}
                >
                  {isNavListVisible ? (
                    <img
                      alt="navIcon"
                      src={navCloseIcon}
                      className="h-[26px]"
                    />
                  ) : (
                    <img alt="navIcon" src={navIcon} className="h-[30px]" />
                  )}
                </span>
                {(isNavListVisible || window.innerWidth > 788) && (
                  <span
                    className={`${isNavListVisible ? "active" : ""} navList`}
                  >
                    {userInfo ? (
                      <ul className="flex flex-col md:flex-row ">
                        <li onClick={() => setIsNavListVisible(false)}>
                          <Link
                            to={RAILWAY_CONST.ROUTE.DASHBOARD}
                            className="hover:text-[#9b4b90] transition p-[10px] block"
                          >
                            Dashboard
                          </Link>{" "}
                        </li>
                        <li
                          className="ml-0 pl-0 border-t sm:border-t sm:border-transparent border-[#efefef]"
                          onClick={() => setIsNavListVisible(false)}
                        >
                          <Link
                            to={RAILWAY_CONST.ROUTE.REPORTS}
                            className="hover:text-[#9b4b90] transition p-[10px] block ml-0"
                          >
                            Reports
                          </Link>
                        </li>
                      </ul>
                    ) : (
                      <Link
                        to="/login"
                        className="hover:text-[#9b4b90] transition p-[10px] inline-block"
                      >
                        <span className="font-medium loginText hover:text-[#9b4b90] text-[#000] ml-2">
                          Login
                        </span>
                      </Link>
                    )}
                  </span>
                )}
              </nav>

              <div
                className="flex userCol items-center border-l border-gray-300 pl-2 ml-4 relative"
                onClick={toggleUserInfo}
              >
                {userInfo ? (
                  <div className="h-[36px]">
                    <span className="headerUserIcon relative pr-[15px] inline-block">
                      <img
                        src={userIcon}
                        alt="User Icon"
                        className="mr-2 rounded-full cursor-pointer"
                        height={35}
                        width={35}
                      />
                    </span>
                    {isUserInfoVisible && (
                      <div className="absolute userInfoCol right-[10px] bg-white top-[40px] shadow-md z-10">
                        <ul className="w-[200px]">
                          {userInfo?.name && (
                            <li className="w-full px-4 py-2 border-b border-[#efefef]">
                              <span className="text-gray-700 font-medium block"></span>
                            </li>
                          )}
                          <li
                            onClick={logout}
                            className="w-full px-4 py-2 border-b hover:bg-[#f1f1f1] cursor-pointer"
                          >
                            <span>Logout</span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </header>
      </>
    </div>
  );
};

export default Header;
