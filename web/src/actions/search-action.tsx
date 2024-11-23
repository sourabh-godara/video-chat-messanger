'use server'
import { User } from '@/types';
import { PrismaClient } from '@prisma/client'
import { getUserIdFromSession } from '@/lib';

const prisma = new PrismaClient({})

export default async function searchUser(query: string): Promise<User[]> {
    const loggedInUserId = await getUserIdFromSession();
    if (!query || !loggedInUserId) {
        throw new Error('Query and UserId are required');
    }
    try {
        const users = await prisma.user.findMany({
            where: {
                AND: [
                    {
                        id: {
                            notIn: [loggedInUserId],
                        },
                    },
                    {
                        OR: [
                            { name: { contains: query, mode: 'insensitive' } },
                            { email: { contains: query, mode: 'insensitive' } },
                        ],
                    },
                    {
                        NOT: {
                            friendsInitiated: {
                                some: {
                                    friendId: loggedInUserId
                                }
                            }
                        }
                    },
                    {
                        NOT: {
                            friendsAccepted: {
                                some: {
                                    userId: loggedInUserId
                                }
                            }
                        }
                    }
                ],
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                createdAt: true
            },
            take: 10,
        });
        console.log({ users })
        return users;
    } catch (error) {
        console.log({ error })
        throw new Error('Error while searching user')
    }
}

