import axios from "axios";
import Cookies from "js-cookie";
import { COOKIES } from "./constant/Storage";

console.log(
  "Cookies.get(COOKIES.ACCESS_TOKEN)",
  Cookies.get(COOKIES.ACCESS_TOKEN)
);

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshToken = async () => {
  const refreshToken = Cookies.get(COOKIES.REFRESH_TOKEN);
  const resp = await axiosInstance.post("/api/auth/refreshToken", {
    refreshToken,
  });
  console.log("anilog ~ resp: test", resp);
  return resp.data;
};
axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get(COOKIES.ACCESS_TOKEN);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const resp = await refreshToken();
      const accessToken = resp.accessToken;
      Cookies.set(COOKIES.ACCESS_TOKEN, accessToken);
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken}`;
      return axiosInstance(originalRequest);
    }
    return Promise.reject(error);
  }
);
