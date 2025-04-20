import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5004/api" : "https://inventory-18le.onrender.com/api",
  withCredentials: true,
});
