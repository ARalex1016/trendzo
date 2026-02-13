import axios from "axios";

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? `${serverUrl}/api` : "/api",
  withCredentials: true,
});
