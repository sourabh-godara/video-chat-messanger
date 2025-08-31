'use client'
import React from 'react'
import { useEffect } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSocket } from '@/Providers/SocketProvider';
import { ChatType } from '@/types'

interface MessageListProps {
  chat: ChatType['messages']
  userId: string;
}
export default function MessageList({chat, userId}: MessageListProps) {
    const { loadMessages, messages } = useSocket();
      useEffect(() => {
        loadMessages(chat);
      }, [])
  return (
   <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages?.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === userId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[70%] ${message.senderId === userId ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
  )
}
