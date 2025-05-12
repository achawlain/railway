import axios from "axios";
import { CONFIG } from "./apiConfig";
import { getDataFromLocalStorage } from "../utils/localStorage";

export const client = axios.create({
  baseURL: CONFIG.BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

export const secureClient = axios.create({
  baseURL: CONFIG.BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

// secureClient.interceptors.request.use(
//   (config) => {
//     const userInfo = getDataFromLocalStorage("userInfo");
//     console.log("userInfo", userInfo);
//     if (userInfo && userInfo.access_token) {
//       config.headers["Authorization"] = userInfo.access_token;
//       // config.headers["id-token"] = userInfo.id_token; // Only if id_token exists
//       return config;
//     }
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

secureClient.interceptors.request.use(
  (config) => {
    try {
      const userInfo = getDataFromLocalStorage("userInfo");

      if (userInfo?.access_token) {
        config.headers["Authorization"] = `Bearer ${userInfo.access_token}`;
      }

      return config;
    } catch (error) {
      console.error("Interceptor error:", error);
      return config; // Always return config to avoid request hang
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);
