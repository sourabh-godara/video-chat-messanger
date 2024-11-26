import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChatType } from '@/types'

interface ChatHeaderProps {
    user: ChatType['user']
}

export default function ChatHeader({ user }: ChatHeaderProps) {
    return (
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
        </header>
    )
}
