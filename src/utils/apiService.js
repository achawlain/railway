import { secureClient } from "../config/axiosClient";

export const apiService = async (method, url, data = {}, params = {}) => {
  try {
    const config = {
      method,
      url,
      ...(method === "get" ? { params } : { data }),
    };

    const response = await secureClient(config);
    return response.data;
  } catch (error) {
    console.error(`${method.toUpperCase()} Error:`, error);
    throw error;
  }
};
