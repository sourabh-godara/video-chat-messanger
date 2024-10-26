'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { UserCheck, UserPlus } from 'lucide-react';
import searchUser from '../app/actions/search-action';
import { sendRequest } from '@/app/actions/friend-action';
import { FriendRequestsType, User } from '@/types';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/hooks/use-toast';
import LoadingSpinner from './ui/loading-spinner';

interface props {
    searchQuery: string,
    friendRequests: FriendRequestsType
}
export default function SearchFriend({ friendRequests, searchQuery }: props) {
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [sentFriendRequests, setSentFriendRequests] = useState(new Set(friendRequests.sentRequests.map(req => req.receiverId)));
    const [receivedFriendRequests] = useState(new Set(friendRequests.receivedRequests.map(req => req.senderId)));
    const [error, setError] = useState<string | undefined>()
    const [loading, setLoading] = useState(false);
    const { toast } = useToast()
    const { data: session } = useSession();

    const handleSendRequest = async (userId: string, email: string) => {
        const updatedSentRequests = new Set([...Array.from(sentFriendRequests), userId]);
        try {
            setLoading(true);
            await sendRequest(session?.user.id, email);
            setSentFriendRequests(updatedSentRequests);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: error instanceof Error ? error.message : 'Something went wrong.',
            })
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = useCallback(async () => {
        try {
            const users = await searchUser(searchQuery, session?.user.id);
            setFilteredUsers(users);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Something went wrong.');
        }
    }, [searchQuery, session?.user.id]);

    useEffect(() => {
        if (searchQuery) {
            handleSearch();
        }
    }, [searchQuery, handleSearch]);

    if (error) {
        return (
            <div className="text-red-500 text-center text-sm">{error}</div>
        )
    }
    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Search Results</h3>
            <ul className="space-y-3">
                {filteredUsers.map(user => (
                    <li
                        key={user.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg transition-all hover:bg-gray-100"
                    >
                        <div className="flex items-center space-x-3">
                            <Avatar>
                                <AvatarImage src={user.image || ''} alt={user.name || ''} />
                                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                        </div>
                        {sentFriendRequests.has(user.id) ? (
                            <Button size="sm" variant="outline" className="text-gray-600" disabled>
                                <UserCheck className="h-4 w-4 mr-1" />
                                Sent
                            </Button>
                        ) : receivedFriendRequests.has(user.id) ? (
                            <div className="space-x-2">
                                <Button size="sm" variant="outline" className="text-gray-600 hover:bg-green-100">
                                    Accept
                                </Button>
                                <Button size="sm" variant="outline" className="text-gray-600 hover:bg-red-100">
                                    Decline
                                </Button>
                            </div>
                        ) : (
                            <Button
                                size="sm"
                                variant="outline"
                                className="text-gray-600 hover:bg-gray-200"
                                onClick={() => handleSendRequest(user.id, user.email || '')}
                            >

                                {loading ? <LoadingSpinner /> : <><UserPlus className="h-4 w-4 mr-1" />Add</>}

                            </Button>
                        )}
                    </li>
                ))}
            </ul>
            {!filteredUsers.length && (
                <p className="text-center text-gray-500 mt-4">No users found</p>
            )}
        </div>
    )
}
