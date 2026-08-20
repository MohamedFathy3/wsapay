// lib/api.ts
import axios, { AxiosError } from "axios";
import { tokenService } from "@/services/token.service";

const API_BASE_URL = "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// ✅ Interceptor لإضافة التوكن من Cookies
api.interceptors.request.use(
  (config) => {
    const token = tokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔐 Token added to request");
    }
    console.log(`📡 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error),
);

// ✅ معالجة 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.log("🔐 Unauthorized - clearing session");
      tokenService.clearAll();

      // لو مش في صفحة login، حول عليها
      if (!window.location.pathname.includes("/")) {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
