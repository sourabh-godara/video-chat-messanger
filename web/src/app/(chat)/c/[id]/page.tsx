import { Chat } from '@/components/chat/chat'
import React from 'react'
import { fetchChats } from '@/actions/chat-actions'

type params = {
  params: {
    id: string
  }
}
export default async function page({ params }: params) {
  const chat = await fetchChats(params.id);
  if (!chat) {
    return <p className='m-auto'>Something Went Wrong!</p>
  }
  return (
    <>
      <Chat user={chat.user} chat={chat.messages} receiverId={params.id} />
    </>
  )
}
