'use client'
import { FriendType } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import Link from 'next/link'
import { removeFriend } from '@/actions/friend-action'

export default function FriendItem({ key, friend }: { key: string, friend: FriendType }) {
    return (
        <div>
            <ContextMenu key={key}>
                <ContextMenuTrigger asChild>
                    <Link
                        href={`/c/${friend.id}`}
                        className="flex items-center space-x-4 p-4 hover:bg-accent">
                        <Avatar className="h-9 w-9 rounded-full overflow-hidden">
                            <AvatarImage
                                className="h-full w-full object-cover"
                                src={friend.image || ''}
                                alt={friend.name || 'profile-pic'}
                            />
                            <AvatarFallback className="rounded-full">{friend.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left">
                            <p className="text-sm font-medium leading-none">{friend.name}</p>
                            <p className="text-sm text-muted-foreground">{friend.email}</p>
                        </div>
                    </Link>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem>Delete Chat</ContextMenuItem>
                    <ContextMenuItem className='text-red-500' onClick={() => removeFriend(friend.id)}>Remove</ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>

        </div>
    )
}