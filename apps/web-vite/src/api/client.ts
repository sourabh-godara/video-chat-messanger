import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/authStore";
import type { AuthUser } from "@/types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

export const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
    failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
    failedQueue = [];
}

api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        if (
            error.response?.status !== 401 ||
            originalRequest._retry ||
            originalRequest.url?.includes("/auth/refresh")
        ) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise<string>((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const { data } = await api.post<{
                success: boolean;
                data: { accessToken: string; user: AuthUser };
            }>("/auth/refresh");

            const newToken = data.data.accessToken;
            useAuthStore.getState().setAuth(data.data.user, newToken);
            processQueue(null, newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            useAuthStore.getState().logout();
            window.location.href = "/auth/signin";
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;