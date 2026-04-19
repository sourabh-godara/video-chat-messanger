import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/authStore";
import type { AuthUser } from "@/types";
import { api } from "@/api/client";

export default function AuthProvider({ children }: { children: React.ReactNode }): React.ReactElement {
    const setAuth = useAuthStore((s) => s.setAuth);
    const logout = useAuthStore((s) => s.logout);
    const hasBootstrapped = useRef(false);

    useEffect(() => {
        if (hasBootstrapped.current) return;
        hasBootstrapped.current = true;

        const bootstrap = async () => {
            if (useAuthStore.getState().isAuthenticated) {
                useAuthStore.getState().setLoading(false);
                return;
            }
            try {
                const res = await api.post<{
                    success: boolean;
                    data: { accessToken: string; user: AuthUser };
                }>("/auth/refresh");

                if (res.data.success) {
                    setAuth(res.data.data.user, res.data.data.accessToken);
                } else {
                    logout();
                }
            } catch {
                logout();
            }
        };

        bootstrap();
    }, []);

    return <>{children}</>;
}