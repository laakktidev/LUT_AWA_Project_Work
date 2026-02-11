import axios from "axios";
import { isTokenExpired } from "../utils/isTokenExpired";

const api = axios.create({
  baseURL: "http://localhost:3000", // adjust if needed
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && !isTokenExpired(token)) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Attach logout handler for 401 responses
export function attachAuthInterceptor(logout: () => void) {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logout();
      }
      return Promise.reject(error);
    }
  );
}

export default api;
