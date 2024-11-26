'use client'
import { useEffect, useState } from 'react'
import { Send } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatType } from '@/types'
import { useSocket } from '@/Providers/SocketProvider';

interface ChatProps {
  userId: string;
  chat: ChatType['messages']
  receiverId: string
}

export function Chats({ userId, chat, receiverId }: ChatProps) {
  const { loadMessages, sendMessage, messages } = useSocket();
  const [newMessage, setNewMessage] = useState("");
  useEffect(() => {
    console.log('Loading messages from database...');
    loadMessages(chat);
  }, [])

  return (
    <>

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
      <footer className="border-t border-border p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage(newMessage, receiverId)
            setNewMessage('');
          }}
          className="flex space-x-2"
        >
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </footer>
    </>
  )
}

