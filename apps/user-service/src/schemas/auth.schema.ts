import { z } from "zod";

export const registerSchema = z.object({
    name: z
        .string({ error: "Name is required" })
        .trim()
        .min(1, "Name is required"),
    email: z
        .string({ error: "Email is required" })
        .email("Invalid email address"),
    password: z
        .string({ error: "Password is required" })
        .min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
    email: z
        .string({ error: "Email is required" })
        .email("Invalid email address"),
    password: z
        .string({ error: "Password is required" })
        .min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
    email: z
        .string({ error: "Email is required" })
        .email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
    token: z
        .string({ error: "Token is required" })
        .min(1, "Token is required"),
    password: z
        .string({ error: "Password is required" })
        .min(8, "Password must be at least 8 characters"),
});
