'use client'
import { useState } from 'react'
import { Send, User } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatType } from '@/types'
import { useSession } from 'next-auth/react'
interface ChatMessage {
  id: number
  sender: string
  content: string
  isUser: boolean
}

const chatMessages: ChatMessage[] = [
  { id: 1, sender: "OM", content: "Hi, how can I help you today?", isUser: false },
  { id: 2, sender: "User", content: "Hey, I'm having trouble with my account.", isUser: true },
  { id: 3, sender: "OM", content: "What seems to be the problem?", isUser: false },
  { id: 4, sender: "User", content: "I can't log in.", isUser: true },
]

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

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { id: messages.length + '1', senderId: loggedInUserId, receiverId: receiverId, content: newMessage, createdAt: Date.now() }])
      setNewMessage("")
    }
  }

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
                className={`flex ${message.senderId == loggedInUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[70%] ${message.senderId == loggedInUserId ? 'bg-primary text-primary-foreground' : 'bg-muted'
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
