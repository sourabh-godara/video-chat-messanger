import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ResetPasswordPage from "./pages/ResetpasswordPage";
import ForgotPasswordPage from "./pages/ForgotpasswordPage";
import ProtectedRoute from "./pages/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import HomePage from "./pages/HomePage";

export const router = createBrowserRouter([
    { path: "/auth/signin", element: <SignInPage /> },
    { path: "/auth/signup", element: <SignUpPage /> },
    { path: "/auth/forgot-password", element: <ForgotPasswordPage /> },
    { path: "/auth/reset-password", element: <ResetPasswordPage /> },

    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <AppLayout />,
                children: [
                    { path: "/", element: <HomePage /> },
                    /* { path: "/c/:friendId", element: <ChatPage /> }, */
                ],
            },
        ],
    },


    { path: "*", element: <Navigate to="/" replace /> },
]);

export function AppRouter() {
    return <RouterProvider router={router} />
}