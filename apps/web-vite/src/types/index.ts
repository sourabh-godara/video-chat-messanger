// Re-export all shared types from @repo/types so existing @/types imports keep working.
export type {
    AuthUser,
    AuthTokens,
    User,
    FriendType,
    FriendRequestStatus,
    ReceivedFriendRequest,
    SentFriendRequest,
    FriendRequestsType,
    ChatMessage,
    ChatType,
} from "@repo/types";