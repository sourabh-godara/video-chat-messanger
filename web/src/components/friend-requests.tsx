import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

const incomingRequests = [
    { id: 1, name: 'Alice Johnson', avatar: '/placeholder.svg?height=40&width=40' },
    { id: 2, name: 'Bob Smith', avatar: '/placeholder.svg?height=40&width=40' },
    { id: 3, name: 'Charlie Brown', avatar: '/placeholder.svg?height=40&width=40' },
]
export default function FriendRequests() {
    return (
        <>

            <h3 className="text-lg font-semibold mb-4">Friend Requests</h3>
            <ul className="space-y-3">
                {incomingRequests.map(request => (
                    <li key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-all hover:bg-gray-100">
                        <div className="flex items-center space-x-3">
                            <Avatar>
                                <AvatarImage src={request.avatar} alt={request.name} />
                                <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{request.name}</span>
                        </div>
                        <div className="space-x-2">
                            <Button size="sm" variant="outline" className="text-gray-600 hover:bg-green-100">
                                Accept
                            </Button>
                            <Button size="sm" variant="outline" className="text-gray-600 hover:bg-red-100">
                                Decline
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>
            {
                incomingRequests.length === 0 && (
                    <p className="text-center text-gray-500 mt-4">No pending friend requests</p>
                )
            }
        </>
    )

}
