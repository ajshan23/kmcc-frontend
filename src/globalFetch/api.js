import axios from "axios";
//
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api", // Your backend base URL
  headers: {
    "Content-Type": "application/json", // Default header
  },
});

// Add an interceptor to include the Authorization header
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("_TECHMIN_AUTH_KEY_");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
