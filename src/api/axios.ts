import axios from "axios";

// const API = axios.create({
//   baseURL: "http://127.0.0.1:8000",
// });

const API = axios.create({
  baseURL: "https://holiday-planner-backend-rht3.onrender.com",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
