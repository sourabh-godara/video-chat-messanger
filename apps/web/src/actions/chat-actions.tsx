'use server'
import { verifySession } from "@/app/lib/verify-session";
import { ChatType } from "@/types";
import prisma from "@repo/prisma";

export async function fetchChats(friendId: string): Promise<ChatType | null> {
    const { userId } = await verifySession();
    const friendship = await prisma.friendship.findFirst({
        where: {
            OR: [
                { userId: userId, friendId: friendId },
                { userId: friendId, friendId: userId }
            ]
        }
    });

    if (!friendship) {
        throw new Error('Page Not Found');
    }

    try {
        const [user, messages] = await Promise.all([
            prisma.user.findUnique({
                where: {
                    id: friendId
                },
                select: {
                    name: true,
                    image: true,
                    email: true
                }
            }),
            prisma.message.findMany({
                where: {
                    OR: [
                        { senderId: userId, receiverId: friendId },
                        { senderId: friendId, receiverId: userId }
                    ]
                },
                orderBy: {
                    createdAt: 'asc'
                },
                select: {
                    id: true,
                    senderId: true,
                    receiverId: true,
                    content: true,
                    createdAt: true
                }
            })
        ])
        return { user, messages }
    } catch (error) {
        throw new Error('Something went wrong while fetching chats');
    }
}
