"use client";

import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  createContext,
} from "react";
import { io, Socket } from "socket.io-client";
import { ChatType } from "@/types";

type ChatMessage = ChatType["messages"][0];
const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_SERVER || "http://localhost:8530";

interface SocketProviderProps {
  children: React.ReactNode;
}

interface ISocketContext {
  socket: Socket | undefined;
  joinRoom: (roomId: string) => void;
  loadMessages: (messages: ChatMessage[]) => void;
  sendMessage: (message: string, roomId: string) => void;
  joinedRooms: Set<string>;
  messages: ChatMessage[];
}

const SocketContext = createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const [socket, setSocket] = useState<Socket | undefined>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageQueue, setMessageQueue] = useState<
    Record<string, ChatMessage[]>
  >({}); // Queue per roomId with full messages
  const [joinedRooms, setJoinedRooms] = useState<Set<string>>(new Set());
  useEffect(() => {
    if (status !== "authenticated" || !session?.accessToken) {
      return;
    }

    const newSocket = io(SOCKET_URL, {
      autoConnect: true,
      auth: {
        token: session?.accessToken ?? null,
      },
    });

    setSocket(newSocket);
    newSocket.on("connect", () => {
      console.log("Socket successfully connected with ID:", newSocket.id);
      // Any logic that should happen on connection can go here.
      // For example, if you have a default room to join.
    });

    newSocket.on("join_success", (roomId: string) => {
      setJoinedRooms((prev) => new Set([...prev, roomId]));
      const queued = messageQueue[roomId] || [];
      queued.forEach((newMessage) => {
        newSocket.emit("send_message", newMessage);
      }); // Send queued messages
      setMessageQueue((prev) => {
        const next = { ...prev };
        delete next[roomId];
        return next;
      });
      console.log(`Successfully joined room: ${roomId}`);
    });

    const handleReceiveMessage = (newMessage: ChatMessage) => {
      console.log("Message received in client:", newMessage);
      setMessages((prevMessages) => {
        // Prevent duplicates if any
        if (prevMessages.some((msg) => msg.id === newMessage.id)) {
          return prevMessages;
        }
        return [...prevMessages, newMessage];
      });
    };

    newSocket.on("receive_message", handleReceiveMessage);
    newSocket.on("connect_error", (err) => {
      console.error("❌ Socket connect error:", err.message);
    });
    newSocket.on("error", (err) => {
      console.error("❌ Socket server error:", err);
    });
    return () => {
      newSocket.off("connect");
      newSocket.off("receive_message", handleReceiveMessage);
      newSocket.disconnect();
      setSocket(undefined);
    };
  }, [status, session]);

  const joinRoom = useCallback(
    (roomId: string) => {
      if (joinedRooms.has(roomId)) return;
      socket?.emit("join_room", roomId);
    },
    [socket, joinedRooms]
  );

  const loadMessages = useCallback((initialMessages: ChatMessage[]) => {
    setMessages(initialMessages);
  }, []);

  const sendMessage = useCallback(
    (messageContent: string, roomId: string) => {
      const trimmedMessage = messageContent.trim();
      if (!trimmedMessage || !socket || !session?.user?.id) {
        console.error(
          "Cannot send message: not authenticated, socket not connected, or message is empty."
        );
        return;
      }

      const newMessage: ChatMessage = {
        id: uuidv4(),
        senderId: session.user.id,
        roomId: roomId,
        content: trimmedMessage,
        createdAt: new Date(),
      };

      // Optimistic update
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      if (!joinedRooms.has(roomId)) {
        console.log(`Queuing message for room ${roomId} as not joined yet.`);
        setMessageQueue((prev) => ({
          ...prev,
          [roomId]: [...(prev[roomId] || []), newMessage],
        }));
        joinRoom(roomId);
        return;
      }

      socket.emit("send_message", newMessage);
    },
    [socket, session, joinedRooms, joinRoom]
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        joinRoom,
        sendMessage,
        messages,
        loadMessages,
        joinedRooms,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};