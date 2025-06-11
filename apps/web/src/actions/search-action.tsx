'use server'
import { verifySession } from '@/app/lib/verify-session';
import { User } from '@/types';

import prisma from '@repo/prisma';

export default async function searchUser(query: string): Promise<User[]> {
    const { userId } = await verifySession();
    if (!query) {
        throw new Error('Query is required');
    }
    try {
        const users = await prisma.user.findMany({
            where: {
                AND: [
                    {
                        id: {
                            notIn: [userId],
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
                                    friendId: userId
                                }
                            }
                        }
                    },
                    {
                        NOT: {
                            friendsAccepted: {
                                some: {
                                    userId: userId
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
        return users;
    } catch (error) {
        console.log({ error })
        throw new Error('Error while searching user')
    }
}

