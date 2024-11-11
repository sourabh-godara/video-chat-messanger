import { sendRequest } from '@/actions/friend-action';
import React, { useState } from 'react'
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserCheck, UserPlus } from 'lucide-react';
import { FriendRequestsType, User } from '@/types';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface Props {
    users: User[]
    friendRequests: FriendRequestsType
}
export default function SearchResultCard({ users, friendRequests }: Props) {
    const [sentFriendRequests, setSentFriendRequests] = useState(new Set(friendRequests.sentRequests.map(req => req.receiverId)));
    const [receivedFriendRequests] = useState(new Set(friendRequests.receivedRequests.map(req => req.senderId)));
    const [loadingUser, setLoadingUser] = useState<string>()
    const { toast } = useToast()
    const handleSendRequest = async (userId: string, email: string) => {
        const updatedSentRequests = new Set([...Array.from(sentFriendRequests), userId]);
        try {
            setLoadingUser(email);
            await sendRequest(email);
            setSentFriendRequests(updatedSentRequests);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: error instanceof Error ? error.message : 'Something went wrong.',
            })
        } finally {
            setLoadingUser('');
        }
    };
    return (
        <ul className="space-y-3">
            {users?.map(user => (
                <li
                    key={user.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg transition-all hover:bg-gray-100"
                >
                    <div className="flex items-center space-x-3">
                        <Avatar>
                            <AvatarImage src={user.image || ''} alt={user.name || 'profile-pic'} />
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
                            {loadingUser == user.email ? <LoadingSpinner /> : <><UserPlus className="h-4 w-4 mr-1" />Add</>}
                        </Button>
                    )}
                </li>
            ))}
        </ul>
    )
}
