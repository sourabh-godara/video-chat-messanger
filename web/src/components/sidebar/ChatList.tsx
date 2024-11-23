import Link from 'next/link'
import React, { Suspense } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FriendType } from '@/types'
import { Skeleton } from '@/components/ui/skeleton'
import prisma from "@/lib/database"
import { getUserIdFromSession } from '@/lib'

async function fetchFriends(): Promise<FriendType[]> {
    try {
        const userId = await getUserIdFromSession();
        const res = await prisma.friendship.findMany({
            where: { userId },
            include: {
                friend: {
                    select: { id: true, name: true, email: true, image: true }
                }
            }
        });
        const friends = res.map(f => f.friend);
        return friends
    } catch (error) {
        console.log({ error })
        return [];
    }
}
export default async function ChatList() {
    const friends = await fetchFriends();
    return (
        <>
            <Suspense fallback={<LoadingSkeleton />}>

                {friends?.map((friend) => (
                    <Link
                        href={`/c/${friend.id}`}
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
                ))}
                {friends.length === 0 && <div className='text-sm text-center text-gray-600'>No Friends :{`(`}</div>}
            </Suspense>
        </>
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
