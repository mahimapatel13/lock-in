import axios from "axios";
import { AuthService } from "@/services/authService";

const authService = new AuthService();

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api/v1",
    withCredentials: true, // sends HttpOnly cookie
});

// --------------------
// REQUEST INTERCEPTOR
// --------------------
api.interceptors.request.use(
    (config) => {
        const token = authService.getAccessToken();
        if (token) {
            config.headers["authorization"] = `Bearer ${token}`;
            console.log("Sending request with token ",token);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// --------------------
// RESPONSE INTERCEPTOR
// --------------------
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (token) {
            prom.resolve(token);
        } else {
            prom.reject(error);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => {
        const token = response.headers['authorization'];
        if (token) {
            authService.setAccessToken(token);
            console.log("Token stored in LocalStorage via helper ", token);
        }
        return response;
    },
    async (error) => {
        const originalReq = error.config;

        if (error.response && error.response.status === 401 && !originalReq._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalReq.headers["Authorization"] = `Bearer ${token}`;
                    return api(originalReq);
                });
            }

            originalReq._retry = true;
            isRefreshing = true;

            try {
                const response = await axios.post(
                    "/auth/refresh",
                    {},
                    {
                        baseURL: "http://localhost:8080/api/v1",
                        withCredentials: true,
                    }
                );

                const accessToken = response.data.accessToken;
                authService.setAccessToken(accessToken);

                processQueue(null, accessToken);

                originalReq.headers["Authorization"] = `Bearer ${accessToken}`;
                return api(originalReq);
            } catch (refreshError) {
                processQueue(refreshError, null);
                authService.logout();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
