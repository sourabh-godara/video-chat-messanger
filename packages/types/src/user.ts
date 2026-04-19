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

export type FriendRequestStatus = "PENDING" | "ACCEPTED" | "DECLINED";

export interface ReceivedFriendRequest {
    id: string;
    senderId: string;
    receiverId: string;
    status: FriendRequestStatus;
    createdAt: Date;
    sender: User;
}

export interface SentFriendRequest {
    id: string;
    receiverId: string;
    status: FriendRequestStatus;
    receiver: Pick<User, "id" | "name" | "email" | "image">;
}

export interface FriendRequestsType {
    receivedRequests: ReceivedFriendRequest[];
    sentRequests: SentFriendRequest[];
}
