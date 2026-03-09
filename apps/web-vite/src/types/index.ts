// ── Auth ──────────────────────────────────────────────────────────────────────
export interface AuthUser {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
}

export interface AuthTokens {
    accessToken: string;
    // refresh token lives in HttpOnly cookie — never in JS
}

// ── Users & Friends ───────────────────────────────────────────────────────────
export interface User {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    createdAt: Date;
}

export interface FriendType {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
}

// ── Friend Requests ───────────────────────────────────────────────────────────
export interface ReceivedFriendRequest {
    id: string;
    senderId: string;
    receiverId: string;
    status: "ACCEPTED" | "DECLINED" | "PENDING";
    createdAt: Date;
    sender: User;
}

export interface SentFriendRequest {
    id: string;
    receiverId: string;
    status: "ACCEPTED" | "DECLINED" | "PENDING";
    receiver: Pick<User, "id" | "name" | "email" | "image">;
}

export interface FriendRequestsType {
    receivedRequests: ReceivedFriendRequest[];
    sentRequests: SentFriendRequest[];
}

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