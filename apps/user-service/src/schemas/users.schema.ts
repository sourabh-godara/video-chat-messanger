import { z } from "zod";

export const updateProfileSchema = z
    .object({
        name: z.string().trim().min(1, "Name cannot be empty").optional(),
        image: z.string().url("Image must be a valid URL").optional(),
    })
    .refine((data) => data.name || data.image, {
        message: "Nothing to update",
    });

export const searchQuerySchema = z.object({
    q: z
        .string({ error: "Search query is required" })
        .trim()
        .min(1, "Search query is required"),
});

export const userIdParamSchema = z.object({
    id: z.string().min(1, "User ID is required"),
});
