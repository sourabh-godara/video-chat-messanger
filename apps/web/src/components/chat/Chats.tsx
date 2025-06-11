'use client'
import { useEffect, useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSocket } from '@/Providers/SocketProvider';
import { Input } from '@/components/ui/input'
import { generatePrivateRoomId } from '@/app/lib'
import { useSession } from 'next-auth/react'

interface ChatProps {
  receiverId: string
}


export function Chats({ receiverId }: ChatProps) {
  const { sendMessage, socket } = useSocket();
  const [newMessage, setNewMessage] = useState("");
  const { data } = useSession();
  const userId = data?.user.id
  const roomId = generatePrivateRoomId(userId, receiverId);
  useEffect(() => {
    if (!roomId || !socket) {
      throw new Error("Something went wrong! Try again later.")
    }
    socket.emit("join-room", roomId)
    return () => {
      socket.emit("leave_room", roomId);
    };
  }, [])

  return (
    <>
      <footer className="border-t border-border p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (newMessage.trim()) {
              sendMessage(newMessage, receiverId, roomId)
              setNewMessage('');
            }
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

