'use client'
import { Input } from './ui/input'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import Link from 'next/link'
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useSession } from 'next-auth/react';
import { Search, UserPlus } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import AddFriend from './add-friend'

interface ChatUser {
  id: number
  name: string
  avatar: string
  status: string
}
const chatUsers: ChatUser[] = [
  { id: 1, name: "Sourabh", avatar: "/placeholder.svg?height=40&width=40", status: "godarasourav181@gmail.com" },
  { id: 2, name: "Sahil", avatar: "/placeholder.svg?height=40&width=40", status: "Hey there!" },
  { id: 3, name: "Ajay", avatar: "/placeholder.svg?height=40&width=40", status: "Hello!" },
  { id: 4, name: "Suresh", avatar: "/placeholder.svg?height=40&width=40", status: "Hi!" },
  { id: 5, name: "Raina Suresh Ji Cricket", avatar: "/placeholder.svg?height=40&width=40", status: "Hey there, I have a new message" },
]
export default function Sidebar() {
  const { status, data } = useSession();
  if (status === "loading") {
    return null;
  }

  return (
    <div className="w-80 border-r border-border hidden md:block">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="flex-1 justify-start text-left font-normal">
                <div className="flex items-center">
                  <Avatar className=' size-9'>
                    <AvatarImage src={data?.user?.image as string} />
                    <AvatarFallback delayMs={600}>CN</AvatarFallback>
                  </Avatar>
                  <div className="ml-2">
                    <p className="text-sm font-medium leading-none">{data?.user?.name}</p>
                    <p className="text-xs text-muted-foreground">{data?.user?.email}</p>
                  </div>
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>User Profile</DialogTitle>
              </DialogHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={data?.user?.image as string} alt={'profile'} />
                  <AvatarFallback>{'SG'}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{data?.user?.name}</h2>
                  <p className="text-sm text-muted-foreground">{data?.user?.email}</p>
                </div>
                <div>
                  <Button>
                    Log Out
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <AddFriend />
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search" className="pl-8" />
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        {chatUsers.map((user) => (
          <Link
            href={`/chat/${user.id}`}
            key={user.id}
            className="w-full rounded p-4 flex items-center space-x-4 hover:bg-accent"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.status}</p>
            </div>
          </Link>
        ))}
      </ScrollArea>
    </div>
  )
}
