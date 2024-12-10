import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api"; // Your API base URL

// Create an Axios instance
const apiClient = axios.create({
    baseURL: BASE_URL,
});

// Request interceptor to attach the access token
apiClient.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration and refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if the error is due to an expired access token
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                // Get refresh token from localStorage
                const refreshToken = localStorage.getItem("refreshToken");

                if (!refreshToken) {
                    throw new Error("Refresh token not available. Please log in again.");
                }

                // Call refresh token API
                const response = await axios.post(`${BASE_URL}/token/refresh/`, {
                    refresh: refreshToken,
                });

                const { access } = response.data;

                // Store new access token in localStorage
                localStorage.setItem("accessToken", access);

                // Retry the original request with the new access token
                originalRequest.headers["Authorization"] = `Bearer ${access}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                // Clear localStorage and redirect to login on refresh failure
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("username");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
