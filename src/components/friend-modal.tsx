import { useState } from 'react'
import { Search, UserPlus, UserCheck, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock data
const incomingRequests = [
    { id: 1, name: 'Alice Johnson', avatar: '/placeholder.svg?height=40&width=40' },
    { id: 2, name: 'Bob Smith', avatar: '/placeholder.svg?height=40&width=40' },
    { id: 3, name: 'Charlie Brown', avatar: '/placeholder.svg?height=40&width=40' },
]

const allUsers = [
    { id: 4, name: 'David Lee', avatar: '/placeholder.svg?height=40&width=40' },
    { id: 5, name: 'Emma Wilson', avatar: '/placeholder.svg?height=40&width=40' },
    { id: 6, name: 'Frank Miller', avatar: '/placeholder.svg?height=40&width=40' },
    { id: 7, name: 'Grace Taylor', avatar: '/placeholder.svg?height=40&width=40' },
]

export default function FriendModal() {
    const [searchQuery, setSearchQuery] = useState('')
    const [sentRequests, setSentRequests] = useState<number[]>([])

    const filteredUsers = allUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleSendRequest = (userId: number) => {
        setSentRequests([...sentRequests, userId])
    }

    const handleClearSearch = () => {
        setSearchQuery('')
    }

    return (
        <div className="w-[400px] h-[600px] mx-auto bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
            <div className="p-6 flex-shrink-0">
                <h2 className="text-2xl font-bold mb-6">Friend Requests</h2>
                <div className="relative mb-6">
                    <Input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-10 py-2 border-gray-300 focus:border-gray-500 focus:ring-gray-500 rounded-lg"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    {searchQuery && (
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleClearSearch}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    )}
                </div>
            </div>

            <ScrollArea className="flex-grow px-6 pb-6">
                {searchQuery ? (
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
                ) : (
                    <>
                        <h3 className="text-lg font-semibold mb-4">Incoming Requests</h3>
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
                                        <Button size="sm" variant="outline" className="text-gray-600 hover:bg-gray-200">
                                            Accept
                                        </Button>
                                        <Button size="sm" variant="outline" className="text-gray-600 hover:bg-gray-200">
                                            Decline
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {incomingRequests.length === 0 && (
                            <p className="text-center text-gray-500 mt-4">No pending friend requests</p>
                        )}
                    </>
                )}
            </ScrollArea>
        </div>
    )
}