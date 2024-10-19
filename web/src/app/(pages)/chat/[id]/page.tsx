import { Chat } from '@/components/chat'
import React from 'react'

type params = {
  params: {
    id: String
  }
}
export default function page({ params }: params) {
  return (
    <>
      <Chat chatId={params.id} />
    </>
  )
}
