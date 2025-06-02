import axios from "axios";
//https://kmcc.gosneakers.in/api
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api", // Your backend base URL
  headers: {
    "Content-Type": "application/json", // Default header
  },
});

// Add an interceptor to include the Authorization header
axiosInstance.interceptors.request.use(async (config) => {
  const dat = localStorage.getItem("_TECHMIN_AUTH_KEY_");
  const data = await JSON.parse(dat);
  const token = data?.token; // Extract the token from your storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
