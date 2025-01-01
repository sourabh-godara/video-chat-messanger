import { Chats } from '@/components/chat/Chats'
import React from 'react'
import { fetchChats } from '@/actions/chat-actions'
import ChatHeader from '@/components/chat/ChatHeader'
import { getUserIdFromSession } from '@/lib'

type params = {
  params: {
    id: string
  }
}
export default async function page({ params }: params) {
  const chat = await fetchChats(params.id);
  const userId = await getUserIdFromSession();
  if (!chat) {
    return <p className='m-auto'>Something Went Wrong!</p>
  }
  return (
    <>
      <div className="flex-1 flex flex-col">
        <ChatHeader user={chat.user} />
        <Chats userId={userId} chat={chat.messages} receiverId={params.id} />
      </div>
    </>
  )
}
