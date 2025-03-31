import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getDataFromLocalStorage } from "./localStorage";

const PrivateRoute = ({ element, ...rest }) => {
  const isAuthenticated = localStorage.getItem("token"); // Check for token
  const userRole = getDataFromLocalStorage("userInfo"); // Assuming role is stored in localStorage
  const location = useLocation(); // Get the current location

  // Redirect to login if not authenticated
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" />;
  // }
  // Check if the URL contains "admin" and the role is "user"
  // if (location.pathname.includes("/admin") && userRole.role == "User") {
  //   return <Navigate to="/" />;
  // }

  // If authenticated and authorized, render the element
  return element;
};

export default PrivateRoute;
