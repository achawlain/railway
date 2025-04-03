import React, { useState, useEffect, useRef } from "react";
import logo from "../../src/images/railwayLogo.png";
import RAILWAY_CONST from "../utils/RailwayConst";

import { Link, useNavigate, NavLink } from "react-router-dom";

import phone from "../../src/images/phone.webp";
import userIcon from "../../src/images/user.svg";
import { getDataFromLocalStorage } from "../utils/localStorage";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
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
        <header className="headerRow top-0 z-20 fixed bg-white w-full flex justify-between items-center px-4 shadow-md">
          <div className="max-w-[1300px] mx-auto flex flex-row justify-between w-full items-center">
            <div className="h-[90px] logoHeader">
              <Link
                to={
                  userInfo
                    ? RAILWAY_CONST.ROUTE.DASHBOARD
                    : RAILWAY_CONST.ROUTE.LOGIN
                }
              >
                <img
                  className="sm:h-[80px] h-[24px] mt-[5px]"
                  src={logo}
                  alt="Logo"
                />
              </Link>
            </div>
            <div className="flex flex-row items-center">
              <nav className="h-[30px]" ref={navListRef}>
                {/* <span className="navIcon cursor-pointer" onClick={toggleNavList}>
                {isNavListVisible ? (
                  <img alt="navIcon" src={navCloseIcon} className="h-[26px]" />
                ) : (
                  <img alt="navIcon" src={navIcon} className="h-[30px]" />
                )}
              </span> */}
                {/* {(isNavListVisible || window.innerWidth > 788) && (
                  <span
                    className={`${isNavListVisible ? "active" : ""} navList`}
                  >
                    {userInfo?.role === "System Admin" ? (
                      <ul className="flex flex-col md:flex-row">
                        <li
                          className="mx-4"
                          onClick={() => setIsNavListVisible(false)}
                        >
                          <NavLink
                            to={RAILWAY_CONST.ROUTE.SUBJECTS}
                            className={({ isActive }) =>
                              `transition ${
                                isActive
                                  ? "text-blue-500" // Active styles
                                  : "hover:text-blue-500 text-gray-700" // Default and hover styles
                              }`
                            }
                          >
                            Subject
                          </NavLink>
                        </li>
                        <li
                          className="mx-4"
                          onClick={() => setIsNavListVisible(false)}
                        >
                          <NavLink
                            to={RAILWAY_CONST.ROUTE.TEST_SERIES}
                            className={({ isActive }) =>
                              `transition ${
                                isActive
                                  ? "text-blue-500" // Active styles
                                  : "hover:text-blue-500 text-gray-700" // Default and hover styles
                              }`
                            }
                          >
                            Test Series
                          </NavLink>
                        </li>
                        <li
                          className="mx-4"
                          onClick={() => setIsNavListVisible(false)}
                        >
                          <NavLink
                            to={RAILWAY_CONST.ROUTE.DASHBOARD}
                            className={({ isActive }) =>
                              `transition ${
                                isActive
                                  ? "text-blue-500" // Active styles
                                  : "hover:text-blue-500 text-gray-700" // Default and hover styles
                              }`
                            }
                          >
                            Dashboard
                          </NavLink>
                        </li>
                        {userInfo && (
                          <li className="flex flex-row justify-center phoneNumber text-[#cc1919] items-center ml-4">
                            <span>
                              <img
                                src={phone}
                                alt="phone icon"
                                className="h-[18px] mr-2"
                              />
                            </span>{" "}
                            999 9999 999
                          </li>
                        )}
                      </ul>
                    ) : (
                      <ul className="flex flex-col md:flex-row space-x-4">
                        <li onClick={() => setIsNavListVisible(false)}>
                          <Link
                            to={RAILWAY_CONST.ROUTE.DASHBOARD}
                            className="hover:text-blue-500 transition"
                          >
                            Dashboard
                          </Link>
                        </li>
                        {userInfo && (
                          <li className="flex flex-row justify-center phoneNumber text-[#cc1919] items-center">
                            <span>
                              <img
                                src={phone}
                                alt="phone icon"
                                className="h-[18px] mr-2"
                              />
                            </span>{" "}
                            999 9999 999
                          </li>
                        )}
                      </ul>
                    )}
                  </span>
                )} */}
              </nav>

              <div
                className="flex userCol items-center border-l border-gray-300 pl-2 ml-4 relative"
                onClick={toggleUserInfo}
              >
                {userInfo ? (
                  <div>
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
                          <li className="w-full px-4 py-2 border-b border-[#efefef]">
                            <span className="text-gray-700 font-medium block">
                              {userInfo?.name}
                            </span>
                          </li>
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
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="hover:text-blue-500 transition flex justify-center items-center"
                    >
                      {/* <span className="headerUserIcon hideDrorpDown relative pr-[15px] inline-block">
                        <img
                          src={userIcon}
                          alt="User Icon"
                          className="mr-2 rounded-full cursor-pointer"
                          height={35}
                          width={35}
                        />
                      </span> */}
                      {window.innerWidth > 788 && (
                        <span className="font-medium loginText text-[#cc1919] ml-2">
                          Login
                        </span>
                      )}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>
      </>
    </div>
  );
};

export default Header;
