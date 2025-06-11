import { Chats } from '@/components/chat/Chats'
import React from 'react'
import { fetchChats } from '@/actions/chat-actions'
import ChatHeader from '@/components/chat/ChatHeader'
import Messages from '@/components/chat/Messages'

interface ChatPageParams {
  params: Promise<{ id: string }>
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <p>{message} Please try again later.</p>
    </div>
  );
}

export default async function ChatPage({ params }: ChatPageParams) {
  try {
    const receiverId = (await params).id;

    if (!receiverId) {
      return <ErrorMessage message="Something went wrong!" />;
    }

    const chatData = await fetchChats(receiverId);

    if (!chatData) {
      return <ErrorMessage message="Something went wrong!" />;
    }

    return (
      <div className="flex-1 flex flex-col">
        <ChatHeader user={chatData.user} />
        <Messages chat={chatData.messages} />
        <Chats receiverId={receiverId} />
      </div>
    );
  } catch (error) {
    console.error('Chat page error:', error);
    return <ErrorMessage message="An unexpected error occurred" />;
  }
}
