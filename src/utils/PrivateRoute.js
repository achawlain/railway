import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getDataFromLocalStorage } from "./localStorage";
import RAILWAY_CONST from "./RailwayConst";

const roleAccessMap = {
  1: [
    RAILWAY_CONST.ROUTE.HOME,
    RAILWAY_CONST.ROUTE.DASHBOARD,
    RAILWAY_CONST.ROUTE.CONTROL_CENTER,
    RAILWAY_CONST.ROUTE.REPORTS,
    RAILWAY_CONST.ROUTE.CREATE_REPORT,
    RAILWAY_CONST.ROUTE.TEMPLATE,
    RAILWAY_CONST.ROUTE.CREATE_TEMPLATE,
    RAILWAY_CONST.ROUTE.PROFILE,
    RAILWAY_CONST.ROUTE.FORGETPASSWORD,
  ],
  2: [RAILWAY_CONST.ROUTE.HOME, RAILWAY_CONST.ROUTE.ROUTE_LIST],
  3: [
    RAILWAY_CONST.ROUTE.HOME,
    RAILWAY_CONST.ROUTE.DASHBOARD,
    RAILWAY_CONST.ROUTE.TEMPLATE,
    RAILWAY_CONST.ROUTE.CONTROL_CENTER,
    RAILWAY_CONST.ROUTE.ROUTE_LIST,
  ],
};

const PrivateRoute = ({ element, ...rest }) => {
  const userInfo = getDataFromLocalStorage("userInfo");
  const location = useLocation();

  // Redirect to login if not authenticated
  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  // const role = userInfo?.user_details?.role;
  // const currentPath = location.pathname.toLowerCase();

  // console.log("role", role, currentPath);

  // const allowedRoutes = roleAccessMap[role] || [];
  // console.log("allowedRoutes", allowedRoutes);
  // const isAllowed = allowedRoutes.some((route) =>
  //   currentPath.startsWith(route.toLowerCase())
  // );

  // if (!isAllowed) {
  //   return (
  //     <Navigate
  //       to="/home"
  //       // state={{ error: "You do not have permission to access this page." }}
  //     />
  //   );
  // }

  // If authenticated and authorized, render the element
  return element;
};

export default PrivateRoute;
