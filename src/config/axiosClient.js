import axios from "axios";
import { CONFIG } from "./apiConfig";

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
