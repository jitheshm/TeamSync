import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, AxiosHeaders, AxiosHeaderValue } from 'axios';
import { APIURL } from "./constants/constant";
import Cookies from 'js-cookie';
import { refreshTokenAdmin, refreshTokenUser } from './api/authService/auth';

console.log("APIURL", APIURL);

export const userInstance: AxiosInstance = axios.create({
    baseURL: `${APIURL}/api`,
});

export const adminInstance: AxiosInstance = axios.create({
    baseURL: `${APIURL}/api`,
});

userInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('team-sync-token');
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

userInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const status = error.response?.status;
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await refreshTokenUser(); // Refresh the user token
                const newAccessToken = Cookies.get('team-sync-token');
                userInstance.defaults.headers['Authorization'] = newAccessToken as AxiosHeaderValue;
                return userInstance(originalRequest); // Retry the original request
            } catch (refreshError) {
                Cookies.remove('team-sync-token');
                localStorage.removeItem('team-sync-refresh-token');

                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

adminInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('team-sync-token');
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

adminInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const status = error.response?.status;
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await refreshTokenAdmin(); // Refresh the admin token
                const newAccessToken = Cookies.get('team-sync-token');
                adminInstance.defaults.headers['Authorization'] = newAccessToken as AxiosHeaderValue;
                return adminInstance(originalRequest); // Retry the original request
            } catch (refreshError) {
                Cookies.remove('team-sync-token');
                localStorage.removeItem('team-sync-refresh-token');
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);
