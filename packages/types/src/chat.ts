import type { User } from "./user.js";

// ── Chat & Messaging ──────────────────────────────────────────────────────────

export interface ChatMessage {
    id: string;
    senderId: string;
    roomId: string;
    content: string;
    createdAt: Date;
}

export interface ChatType {
    user: Pick<User, "name" | "image" | "email"> | null;
    messages: ChatMessage[];
}
