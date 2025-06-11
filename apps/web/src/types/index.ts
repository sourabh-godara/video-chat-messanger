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
export interface ReceivedFriendRequests {
  createdAt: Date;
  id: string;
  receiverId: string;
  sender: User;
  senderId: string;
  status: "ACCEPTED" | "DECLINED" | "PENDING";
}

export interface SentFriendRequests {
  receiverId: string;
}

export interface FriendRequestsType {
  receivedRequests: ReceivedFriendRequests[];
  sentRequests: SentFriendRequests[];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
}

export interface ChatType {
  user: {
    name: string | null;
    image: string | null;
    email: string;
  } | null;
  messages: Message[];
}
