const ENV = "DEV";

export const ALL_API = {
  // DEV_API_HOST: "http://182.77.59.45:5010",
  DEV_API_HOST: "http://122.160.157.197:5010",
};

export const CONFIG = {
  BASE_URL: ALL_API[ENV + "_API_HOST"],
};
export default CONFIG;

export const baseUrl = `${CONFIG.BASE_URL}`;
