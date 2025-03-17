import logout from "@/utils/logout";
import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  withCredentials: true, // For sending cookies
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get(process.env.NEXT_PUBLIC_ACCESS_TOKEN);
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axiosInstance.post("/auth/refresh-access-token");
        const newAccessToken = res.data.accessToken;

        // Set new access token in cookies
        Cookies.set(process.env.NEXT_PUBLIC_ACCESS_TOKEN, newAccessToken);

        // Update the Authorization header
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh Token Expired");
        logout();
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
