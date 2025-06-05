import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://backend.xpertslaw.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add any request modifications here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle any response errors here
    return Promise.reject(error);
  }
);

export default axiosInstance; 