'use server'

import { FriendRequestsType, FriendType } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@repo/prisma";
import { FriendRequestStatus } from "@repo/prisma"
import { verifySession } from "@/app/lib/verify-session";


export async function fetchFriends(): Promise<FriendType[]> {
    try {
        const { userId } = await verifySession();
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
//NEED IMPROVEMENT
export async function respondToFriendRequest(requestId: string, response: FriendRequestStatus) {
    await verifySession();
    if (!requestId || !(response in FriendRequestStatus)) {
        throw new Error('Invalid Request');
    }

    try {
        await prisma.$transaction(async (prisma) => {
            if (response === FriendRequestStatus.ACCEPTED) {
                const friendRequest = await prisma.friendRequest.findUnique({
                    where: { id: requestId },
                    select: { senderId: true, receiverId: true },
                });
                if (!friendRequest) {
                    throw new Error('Friend request is invalid');
                }
                const { senderId, receiverId } = friendRequest;

                await prisma.friendship.createMany({
                    data: [
                        { userId: senderId, friendId: receiverId },
                        { userId: receiverId, friendId: senderId }
                    ],
                    skipDuplicates: true
                });

            }
            revalidatePath('/')
            return await prisma.friendRequest.delete({
                where: { id: requestId }
            });
        });
    } catch (error) {
        throw new Error('Something went wrong')
    }
}

export async function sendRequest(receiverEmail: string) {
    const { userId } = await verifySession();
    const senderId = userId;
    if (!senderId || !receiverEmail) {
        throw new Error('Sender ID and receiver email are required');
    }

    const receiver = await prisma.user.findUnique({
        where: {
            email: receiverEmail,
        },
    });

    if (!receiver) {
        throw new Error('Receiver not found');
    }

    try {
        const existingRequest = await prisma.friendRequest.findFirst({
            where: {
                senderId: senderId,
                receiverId: receiver.id,
            },
        });

        if (existingRequest) {
            throw new Error('Friend request already sent');
        }

        return await prisma.friendRequest.create({
            data: {
                senderId: senderId,
                receiverId: receiver.id,
                status: FriendRequestStatus.PENDING,
            },
        });
    } catch (error) {
        throw new Error('Something went wrong');
    }
}

export async function fetchFriendRequests(): Promise<FriendRequestsType> {
    try {
        const { userId } = await verifySession();

        const [receivedRequests, sentRequests] = await Promise.all([
            prisma.friendRequest.findMany({
                where: {
                    receiverId: userId,
                    status: FriendRequestStatus.PENDING,
                },
                include: { sender: true },
            }),
            prisma.friendRequest.findMany({
                where: {
                    senderId: userId,
                    status: FriendRequestStatus.PENDING,
                },
                select: { receiverId: true },
            }),
        ]);

        return { receivedRequests, sentRequests };

    } catch (error) {
        throw new Error('An unknown error occurred while fetching friend requests');
    }
}

export async function removeFriend(friendId: string) {
    try {
        const { userId } = await verifySession();

        await prisma.friendship.deleteMany({
            where: {
                OR: [
                    { userId: userId, friendId: friendId },
                    { userId: friendId, friendId: userId }
                ]
            }
        });
        revalidatePath('/');
    } catch (error) {
        console.log()
        throw new Error('An unknown error occurred while fetching friend requests');
    }
    return redirect('/')
}
