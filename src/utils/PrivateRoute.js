import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getDataFromLocalStorage } from "./localStorage";

const PrivateRoute = ({ element, ...rest }) => {
  // const isAuthenticated = localStorage.getItem("token"); // Check for token
  const userInfo = getDataFromLocalStorage("userInfo"); // Assuming role is stored in localStorage
  const location = useLocation(); // Get the current location

  // Redirect to login if not authenticated

  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  // If authenticated and authorized, render the element
  return element;
};

export default PrivateRoute;
