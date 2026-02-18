import axios from "axios";

const serverUrl = import.meta.env.VITE_SERVER_URL;

console.log(serverUrl);

export const axiosInstance = axios.create({
  baseURL: `${serverUrl}/api`,
  withCredentials: true,
});
