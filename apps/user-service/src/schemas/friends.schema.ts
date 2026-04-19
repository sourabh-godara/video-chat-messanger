import { z } from "zod";

export const sendRequestSchema = z.object({
    receiverId: z
        .string({ error: "receiverId is required" })
        .min(1, "receiverId is required"),
});

export const respondRequestSchema = z.object({
    action: z.enum(["ACCEPTED", "DECLINED"] as const, {
        error: "action must be ACCEPTED or DECLINED",
    }),
});

export const requestIdParamSchema = z.object({
    requestId: z.string().min(1, "requestId is required"),
});

export const friendIdParamSchema = z.object({
    friendId: z.string().min(1, "friendId is required"),
});
