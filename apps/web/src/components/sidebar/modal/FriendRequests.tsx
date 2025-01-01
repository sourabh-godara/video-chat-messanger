import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui//button';
import { ReceivedFriendRequests } from '@/types';
import { FriendRequestStatus } from '@prisma/client';
import { respondToFriendRequest } from '@/actions/friend-action';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface Props {
    receivedRequests: ReceivedFriendRequests[]
    onUpdateReceivedRequests: (requests: ReceivedFriendRequests[]) => void
}
export default function FriendRequests({ receivedRequests, onUpdateReceivedRequests }: Props) {
    const [loading, setLoading] = useState(false);
    const [newFriend, setNewFriend] = useState<string>('');
    const { toast } = useToast()
    const handleRequest = async (requestId: string, status: FriendRequestStatus) => {
        if (status === FriendRequestStatus.ACCEPTED) {
            setNewFriend(requestId)
        } else {
            const updatedReceivedRequests = receivedRequests.filter(
                (request) => request.id !== requestId
            );
            onUpdateReceivedRequests(updatedReceivedRequests);
        }
        try {
            setLoading(true)
            await respondToFriendRequest(requestId, status)
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: error instanceof Error ? error.message : 'Something went wrong.',
            })
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
            <h3 className="text-lg font-semibold mb-4">Friend Requests</h3>
            <ul className="space-y-3">
                {receivedRequests.map(({ id, sender }) => (
                    <li key={id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg transition-all hover:bg-gray-100">
                        <div className="flex items-center space-x-3">
                            <Avatar>
                                <AvatarImage src={sender.image!} alt={sender.name!} />
                                <AvatarFallback>{sender.name!.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{sender.name}</span>
                        </div>
                        {loading ? <LoadingSpinner /> : newFriend == id ? <>
                            <Button size="sm" variant="outline" className="text-gray-800 bg-green-600 hover:bg-green-700">
                                Friends
                            </Button>
                        </> : (<div className="space-x-2">
                            <Button onClick={() => handleRequest(id, 'ACCEPTED')} size="sm" variant="outline" className="text-gray-600 hover:bg-green-100">
                                Accept
                            </Button>
                            <Button onClick={() => handleRequest(id, 'DECLINED')} size="sm" variant="outline" className="text-gray-600 hover:bg-red-100">
                                Decline
                            </Button>
                        </div>)}

                    </li>
                ))}
            </ul>
            {receivedRequests?.length === 0 && (
                <p className="text-center text-gray-500 mt-4">No pending friend requests</p>
            )}
        </>
    )

}
