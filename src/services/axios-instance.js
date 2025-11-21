const BASE_URL = "http://localhost:4000/api/v2";
console.log("BASE URL: ", BASE_URL);
import axios from "axios";
import { toast } from "sonner";
import { saveAccessToken } from "../utils/tokenStore";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers = [];

// Subscribe request to token refresh
const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

// Notify all subscribed requests when token is refreshed
const onRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

let currentToken = null;
let tokenUpdateCallback = null;

export const setTokenUpdateCallback = (callback) => {
  tokenUpdateCallback = callback;
};

export const setCurrentToken = (token) => {
  currentToken = token;
};

axiosInstance.interceptors.request.use(
  (config) => {
    if (currentToken) {
      config.headers["Authorization"] = `Bearer ${currentToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only retry on 401 and if it hasn't been retried already
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
          }
        );

        const newToken = response.data.accessToken;
        setCurrentToken(newToken);
        console.log("Refresh token in axios instance: ", newToken);

        if (tokenUpdateCallback) {
          tokenUpdateCallback(newToken);
        }

        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        // saveAccessToken(newToken);
        onRefreshed(newToken);

        isRefreshing = false;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = [];

        setCurrentToken(null);

        try {
          //   handleLogout();
          toast.info("Session expired. Please log in again.");
        } catch (err) {
          console.error("handleLogout is not defined or failed:", err);
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
