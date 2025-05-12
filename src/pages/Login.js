import React, { useState } from "react";
import { apiService, apiServiceWithOutToken } from "../utils/apiService";
import RAILWAY_CONST from "../utils/RailwayConst";
import { useNavigate } from "react-router-dom";
import { setDataOnLocalStorage } from "../utils/localStorage";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

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
  const getChartSpeedBeforeHaltData = async () => {
    let data = {
      username: email,
      password: password,
    };
    try {
      const response = await apiServiceWithOutToken(
        "post",
        RAILWAY_CONST.API_ENDPOINT.LOGIN,
        data
      );
      const userObj = response.data;

      setDataOnLocalStorage("userInfo", userObj);
      navigate(RAILWAY_CONST.ROUTE.HOME);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen reportGenerateBg mt-8">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
