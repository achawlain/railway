import React, { useState, useEffect, useRef } from "react";
import logo from "../../src/images/logo.png";
import railPlotLogo from "../../src/images/railPlotLogo.png";
import logoIconRailPlot from "../../src/images/logoIconRailPlot.png";
import RAILWAY_CONST from "../utils/RailwayConst";
import { Link, useNavigate, NavLink } from "react-router-dom";
import userIcon from "../../src/images/user.svg";
import { getDataFromLocalStorage } from "../utils/localStorage";
import { useLocation } from "react-router-dom";
import navIcon from "../../src/images/navIcon.svg";
import navCloseIcon from "../../src/images/closeIcon.svg";

import userIconNew from "../../src/images/userIcon.svg";
import profileIcon from "../../src/images/profileIcon.svg";
import logoutIcon from "../../src/images/logoutIcon.svg";

const Header = () => {
  const location = useLocation();
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isNavListVisible, setIsNavListVisible] = useState(false);
  const [isUserInfoVisible, setIsUserInfoVisible] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const navListRef = useRef(null);
  const userRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutsideUserInfo = (event) => {
      if (userRef.current && !userRef.current.contains(event.target)) {
        setIsUserInfoVisible(false);
      }
    };

    if (isUserInfoVisible) {
      document.addEventListener("mousedown", handleClickOutsideUserInfo);
    } else {
      document.removeEventListener("mousedown", handleClickOutsideUserInfo);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideUserInfo);
    };
  }, [isUserInfoVisible]);
  return (
    <div>
      <>
        <header className="headerRow top-0 z-40 fixed bg-white w-full flex justify-between items-center px-4 shadow-md">
          <div className="max-w-[1560px] mx-auto flex flex-row justify-between w-full items-center">
            <div className="h-[80px] logoHeader">
              <Link
                to={
                  userInfo ? RAILWAY_CONST.ROUTE.HOME : RAILWAY_CONST.ROUTE.HOME
                }
              >
                {/* <span className="flex flex-row justify-center items-center">
                  <img
                    className="sm:h-[80px] h-[24px] mt-[5px]"
                    src={logo}
                    alt="Logo"
                  />
                  <span className="text-[24px] ml-2 font-semibold flex flex-col logoText">
                    EASTERN RAILWAY, ASANSOL DIVISION
                    <span className="text-[18px] font-normal">
                      Ministry of Railways, Govt of India.
                    </span>
                  </span>
                </span> */}
                <span className="flex flex-row">
                  <img
                    src={logoIconRailPlot}
                    alt="logo"
                    className="sm:h-[51px] h-[47px] mr-[4px]"
                  />
                  <span className="flex flex-col">
                    <img
                      src={railPlotLogo}
                      alt="logo"
                      className="sm:h-[30px] h-[26px] mb-[4px]"
                    />
                    <span className=" sm:text-[10px] text-[9px] ml-[1px] leading-[14px] border-black border-b border-t inline-block">
                      <span className="text-[#d7270c] sm:text-[13px] text-[11px] font-bold">
                        V
                      </span>
                      isualize{" "}
                      <span className="text-[#d7270c] sm:text-[13px] text-[11px] font-bold">
                        A
                      </span>
                      nalyze{" "}
                      <span className="text-[#d7270c] sm:text-[13px] text-[11px] font-bold">
                        O
                      </span>
                      ptimize
                    </span>
                  </span>
                </span>
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
                          <NavLink
                            to={RAILWAY_CONST.ROUTE.HOME}
                            className={({ isActive }) =>
                              `hover:text-[#9b4b90] transition p-[10px] block ${
                                isActive
                                  ? "text-[#9b4b90] font-medium underline"
                                  : ""
                              }`
                            }
                          >
                            Home
                          </NavLink>{" "}
                        </li>
                        {(userInfo.user_details.role === 1 ||
                          userInfo.user_details.role === 3) && (
                          <li onClick={() => setIsNavListVisible(false)}>
                            <NavLink
                              to={RAILWAY_CONST.ROUTE.DASHBOARD}
                              className={({ isActive }) =>
                                `hover:text-[#9b4b90] transition p-[10px] block ${
                                  isActive
                                    ? "text-[#9b4b90] font-medium underline"
                                    : ""
                                }`
                              }
                            >
                              Dashboard
                            </NavLink>{" "}
                          </li>
                        )}

                        {(userInfo.user_details.role === 1 ||
                          userInfo.user_details.role === 3) && (
                          <li
                            className="ml-0 pl-0 border-t sm:border-t sm:border-transparent border-[#efefef]"
                            onClick={() => setIsNavListVisible(false)}
                          >
                            <NavLink
                              to={RAILWAY_CONST.ROUTE.CONTROL_CENTER}
                              className={({ isActive }) =>
                                `hover:text-[#9b4b90] transition p-[10px] block ${
                                  isActive
                                    ? "text-[#9b4b90] font-medium underline"
                                    : ""
                                }`
                              }
                            >
                              Control Center
                            </NavLink>
                          </li>
                        )}
                        {(userInfo.user_details.role === 2 ||
                          userInfo.user_details.role === 3) && (
                          <li
                            className="ml-0 pl-0 border-t sm:border-t sm:border-transparent border-[#efefef]"
                            onClick={() => setIsNavListVisible(false)}
                          >
                            <NavLink
                              to={RAILWAY_CONST.ROUTE.ROUTELIST}
                              className={({ isActive }) =>
                                `hover:text-[#9b4b90] transition p-[10px] block ${
                                  isActive
                                    ? "text-[#9b4b90] font-medium underline"
                                    : ""
                                }`
                              }
                            >
                              Route List
                            </NavLink>
                          </li>
                        )}
                      </ul>
                    ) : (
                      <ul className="flex flex-col md:flex-row ">
                        <li onClick={() => setIsNavListVisible(false)}>
                          <NavLink
                            to={RAILWAY_CONST.ROUTE.HOME}
                            className={({ isActive }) =>
                              `hover:text-[#9b4b90] transition p-[10px] block ${
                                isActive
                                  ? "text-[#9b4b90] font-medium underline"
                                  : ""
                              }`
                            }
                          >
                            Home
                          </NavLink>{" "}
                        </li>
                        <li>
                          <Link
                            to="/login"
                            className="hover:text-[#9b4b90] transition p-[10px] block"
                          >
                            <span className="font-medium loginText hover:text-[#9b4b90] text-[#000] ml-2">
                              Login
                            </span>
                          </Link>
                        </li>
                      </ul>
                    )}
                  </span>
                )}
              </nav>

              <div
                className="flex userCol items-center border-l border-gray-300 pl-2 ml-4 relative"
                onClick={toggleUserInfo}
              >
                {userInfo ? (
                  <div className="h-[36px]" ref={userRef}>
                    <span className="headerUserIcon relative inline-block">
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
                          {userInfo?.user_details?.name && (
                            <li className="w-full px-4 py-2 border-b border-[#efefef] flex">
                              <span>
                                <img
                                  src={userIconNew}
                                  alt="icon"
                                  className="h-[20px] mr-[15px]"
                                />
                              </span>
                              <span className="text-gray-700 font-medium flex">
                                Hi,
                                <span className="text-[#9b4b90] ml-1 w-[100px] inline-block truncate">
                                  {userInfo.user_details.name}
                                </span>
                              </span>
                            </li>
                          )}
                          <li>
                            <Link
                              to={RAILWAY_CONST.ROUTE.PROFILE}
                              className="w-full px-4 py-2 border-b hover:bg-[#f1f1f1] cursor-pointer flex"
                            >
                              <span>
                                <img
                                  src={profileIcon}
                                  alt="icon"
                                  className="h-[20px] mr-[15px]"
                                />
                              </span>
                              <span>Profile</span>
                            </Link>
                          </li>
                          <li
                            id="logoutButton"
                            onClick={logout}
                            className="w-full px-4 py-2 border-b hover:bg-[#f1f1f1] cursor-pointer flex"
                          >
                            <span className="w-[30px]">
                              <img
                                src={logoutIcon}
                                alt="icon"
                                className="h-[17px] mr-[15px] pl-[4px] mt-[2px]"
                              />
                            </span>
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
