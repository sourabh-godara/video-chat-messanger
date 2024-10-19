'use state'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { UserCheck, UserPlus } from 'lucide-react';

interface props {
    searchQuery: string,
}
const allUsers = [
    { id: 4, name: 'David Lee', avatar: '/placeholder.svg?height=40&width=40' },
    { id: 5, name: 'Emma Wilson', avatar: '/placeholder.svg?height=40&width=40' },
    { id: 6, name: 'Frank Miller', avatar: '/placeholder.svg?height=40&width=40' },
    { id: 7, name: 'Grace Taylor', avatar: '/placeholder.svg?height=40&width=40' },
]
export default function SearchFriend({ searchQuery }: props) {
    const [sentRequests, setSentRequests] = useState<number[]>([])

    const filteredUsers = allUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleSendRequest = (userId: number) => {
        setSentRequests([...sentRequests, userId])
    }
    return (
        <>
            <h3 className="text-lg font-semibold mb-4">Search Results</h3>
            <ul className="space-y-3">
                {filteredUsers.map(user => (
                    <li key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-all hover:bg-gray-100">
                        <div className="flex items-center space-x-3">
                            <Avatar>
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                        </div>
                        {sentRequests.includes(user.id) ? (
                            <Button size="sm" variant="outline" className="text-gray-600" disabled>
                                <UserCheck className="h-4 w-4 mr-1" />
                                Sent
                            </Button>
                        ) : (
                            <Button
                                size="sm"
                                variant="outline"
                                className="text-gray-600 hover:bg-gray-200"
                                onClick={() => handleSendRequest(user.id)}
                            >
                                <UserPlus className="h-4 w-4 mr-1" />
                                Add
                            </Button>
                        )}
                    </li>
                ))}
            </ul>
            {filteredUsers.length === 0 && (
                <p className="text-center text-gray-500 mt-4">No users found</p>
            )}
        </>
    )
}
