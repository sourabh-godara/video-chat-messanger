import { ChatInput } from "@/components/chat/ChatInput";
import React from "react";
import { fetchChats } from "@/actions/chat-actions";
import ChatHeader from "@/components/chat/ChatHeader";
import { getUserIdFromSession } from "@/lib";
import MessageList from "@/components/chat/MessageList";

type params = {
  params: Promise<{ id: string }>;
};
export default async function page({ params }: params) {
  const receiverId = (await params).id;
  const chat = await fetchChats(receiverId);
  const userId = await getUserIdFromSession();
  if (!chat) {
    return <p className="m-auto">Something Went Wrong!</p>;
  }
  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader user={chat.user} />
      <div className="flex-1 overflow-y-auto">
        <MessageList chat={chat.messages} userId={userId} />
      </div>
      <ChatInput receiverId={receiverId} />
    </div>
  );
}
