'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { fetchFriends } from '@/app/actions/friend-action'
import { FriendType } from '@/types'
import { Skeleton } from './ui/skeleton'

export default function ChatThreads() {
    const [friends, setFriends] = useState<FriendType[]>([])
    const [error, setError] = useState<string | undefined>()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchChatThreads = async () => {
            try {
                const res = await fetchFriends();
                console.log(res);
                setFriends(res);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Something went wrong.');
            } finally {
                setIsLoading(false);
            }
        }
        fetchChatThreads();
    }, [])

    if (isLoading) {
        return <LoadingSkeleton />
    }
    if (error) {
        <p className="text-red-600">{error}</p>
    }
    return (
        <div>
            {friends?.map(({ friend }) => (
                <Link
                    href={`/chat/${friend.id}`}
                    key={friend.id}
                    className="w-full rounded p-4 flex items-center space-x-4 hover:bg-accent"
                >
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={friend.image || ''} alt={friend.name || 'profile-pic'} />
                        <AvatarFallback>{friend.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                        <p className="text-sm font-medium leading-none">{friend.name}</p>
                        <p className="text-sm text-muted-foreground">{friend.email}</p>
                    </div>
                </Link>
            ))
            }
            {friends.length === 0 && <div className='text-sm text-center text-gray-600'>No Friends :{`(`}</div>}
        </div>
    )
}

function LoadingSkeleton() {
    return (
        <div className="space-y-2">
            {[...Array(3)].map((_, index) => (
                <div key={index} className="w-full rounded-lg p-4 flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                    </div>
                </div>
            ))}
        </div>
    )
}
