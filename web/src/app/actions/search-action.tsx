'use server'
import { User } from '@/types';
import { PrismaClient } from '@prisma/client'
import { fetchFriends } from './friend-action';

const prisma = new PrismaClient({})

export default async function searchUser(query: string, loggedInUserId: string): Promise<User[]> {
    if (!query || !loggedInUserId) {
        throw new Error('Query and UserId are required');
    }
    try {
        const friends = await fetchFriends();
        const friendIds = friends.flatMap(friendship =>
            friendship.friend.id
        );
        const users = await prisma.user.findMany({
            where: {
                AND: [
                    {
                        id: {
                            notIn: [...friendIds, loggedInUserId],
                        },
                    },
                    {
                        OR: [
                            { name: { contains: query, mode: 'insensitive' } },
                            { email: { contains: query, mode: 'insensitive' } },
                        ],
                    },
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
        throw new Error('Error while searching user')
    }
}

