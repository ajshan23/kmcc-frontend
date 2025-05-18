import axios from "axios";
//http://13.203.184.112:3000/api
const axiosInstance = axios.create({
  baseURL: "https://kmcc.gosneakers.in/api", // Your backend base URL
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
