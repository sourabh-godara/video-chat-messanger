"use client";
import React, { useEffect } from "react";
import MessageList from "./MessageList";
import { ChatInput } from "./ChatInput";
import { ChatType } from "@/types";
import { useSocket } from "@/Providers/SocketProvider";
import { generateRoomId } from "@/lib/generateRoomId";

interface ChatRoomProps {
  chat: ChatType["messages"];
  receiverId: string;
  userId: string;
}

export default function ChatRoom({ chat, receiverId, userId }: ChatRoomProps) {
  const { socket, joinRoom, sendMessage, loadMessages, joinedRooms, messages } =
    useSocket();
  const roomId = generateRoomId(userId, receiverId);
  useEffect(() => {
    if (socket && roomId) {
      joinRoom(roomId);
    }
    loadMessages(chat);
  }, [socket, roomId, loadMessages, joinRoom, chat]);
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <MessageList userId={userId} messages={messages} />
      </div>
      <ChatInput
        roomId={roomId}
        sendMessage={sendMessage}
        isJoined={joinedRooms.has(roomId)}
      />
    </div>
  );
}
