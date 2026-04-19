import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuthStore();
    console.log({ isAuthenticated })
    const location = useLocation();

    // AuthProvider is still bootstrapping session from refresh cookie
    if (isLoading) {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                    background: "#141210",
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <div
                        style={{
                            width: "40px",
                            height: "40px",
                            border: "2px solid rgba(212,175,95,0.2)",
                            borderTop: "2px solid rgba(212,175,95,0.9)",
                            borderRadius: "50%",
                            animation: "spin 0.8s linear infinite",
                            margin: "0 auto 16px",
                        }}
                    />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    // Not authenticated — redirect to sign in, preserve intended destination
    if (!isAuthenticated) {
        return <Navigate to="/auth/signin" state={{ from: location }} replace />;
    }

    // Authenticated — render nested routes (AppLayout → ChatPage etc.)
    return <Outlet />;
}