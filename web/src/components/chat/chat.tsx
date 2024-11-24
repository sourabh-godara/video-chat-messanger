'use client'
import { useCallback, useEffect, useState } from 'react'
import { Send, User } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatType } from '@/types'
import { useSession } from 'next-auth/react'
import { io } from 'socket.io-client'

interface ChatProps {
  user: ChatType['user'],
  chat: ChatType['messages']
  receiverId: string
}

export function Chat({ user, chat, receiverId }: ChatProps) {
  const [messages, setMessages] = useState(chat)
  const [newMessage, setNewMessage] = useState("")
  const { data } = useSession();
  const loggedInUserId = data?.user.id;
  const socket = io(process.env.NODE_ENV == 'production' ? process.env.NEXT_PUBLIC_SOCKET_SERVER : 'http://localhost:8530');

  const handleSendMessage = useCallback(() => {
    if (newMessage.trim()) {
      setMessages(prevMessages => [...prevMessages, {
        id: new Date().toISOString(), // More reliable unique ID
        senderId: loggedInUserId,
        receiverId: receiverId,
        content: newMessage,
        createdAt: new Date()
      }])
      socket.emit("msg", { msg: newMessage, receiverId });
      setNewMessage("")
    }
  }, [newMessage, loggedInUserId, receiverId]);

  useEffect(() => {
    const handleMessage = (msg: any) => {
      setMessages(prevMessages => [...prevMessages, {
        id: new Date().toISOString(),
        senderId: receiverId,
        content: msg.msg,
        receiverId: loggedInUserId,
        createdAt: new Date()
      }])
    }
    socket.on("connect", () => {
      console.log('Socket Connected: ', socket.id);
    });
    if (loggedInUserId) {
      console.log('listening to: ', loggedInUserId)
      socket.on(loggedInUserId, handleMessage);
    }
    // Cleanup listeners
    return () => {
      socket.off("connect");
      if (loggedInUserId) {
        socket.off(loggedInUserId, handleMessage);
      }
    }
  }, [loggedInUserId, receiverId])

  return (
    <>
      <div className="flex-1 flex flex-col">
        <header className="border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-9 w-9">
              <AvatarImage src={'/avatar.png'} alt={'user-image'} />
              <AvatarFallback>{'SS'}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-sm font-medium">{user?.name}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden">
            <User className="h-5 w-5" />
          </Button>
        </header>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages?.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === loggedInUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[70%] ${message.senderId === loggedInUserId ? 'bg-primary text-primary-foreground' : 'bg-muted'
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
              handleSendMessage()
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
      </div>
    </>
  )
}

