import axios from "axios";
import { logout, getAccessToken, setAccessToken } from "@/services/authService";

const api = axios.create({
  baseURL: process.env.API_BASE_URL,
  withCredentials: true, // sends HttpOnly cookie
});

// Request: attach access token
api.interceptors.request.use(config => {
  const token = getAccessToken();
  if (token) config.headers!["Authorization"] = `Bearer ${token}`;
  return config;
});

// Response: handle 401, refresh token, retry once
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    token ? prom.resolve(token) : prom.reject(error);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  response => response,
  async error => {
    const originalReq = error.config;
    if (error.response?.status === 401 && !originalReq._retry) {
      if (isRefreshing) {
        // queue requests while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalReq.headers!["Authorization"] = `Bearer ${token}`;
          return api(originalReq);
        });
      }

      originalReq._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          "/auth/refresh",
          {},
          { baseURL: process.env.API_BASE_URL, withCredentials: true }
        );
        setAccessToken(data.accessToken);
        processQueue(null, data.accessToken);
        originalReq.headers!["Authorization"] = `Bearer ${data.accessToken}`;
        return api(originalReq);
      } catch (refreshError) {
        processQueue(refreshError, null);
        logout(); // clear state and redirect to /login
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;