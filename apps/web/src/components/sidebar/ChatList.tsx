import React, { Suspense } from 'react'
import { FriendType } from '@/types'
import { Skeleton } from '@/components/ui/skeleton'
import prisma from '@repo/prisma'
import { getUserIdFromSession } from '@/lib'
import FriendItem from '../FriendItem'

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
        throw new Error('Something went wrong :(')
    }
}
export default async function ChatList() {
    const friends = await fetchFriends();
    return (
        <>
            <Suspense fallback={<LoadingSkeleton />}>

                {friends?.map((friend) => (
                    <FriendItem key={friend.id} friend={friend} />
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
