import { create } from "zustand";
import type { AuthUser } from "@/types";

interface AuthState {
    user: AuthUser | null;
    accessToken: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;

    setAuth: (user: AuthUser, accessToken: string) => void;
    setAccessToken: (token: string) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    isLoading: true,
    isAuthenticated: false,

    setAuth: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true, isLoading: false }),

    setAccessToken: (token) => set({ accessToken: token }),

    logout: () =>
        set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
        }),

    setLoading: (loading) => set({ isLoading: loading }),
}));