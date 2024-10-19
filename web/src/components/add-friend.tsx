'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Search, UserPlus, X } from 'lucide-react';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import FriendRequests from './friend-requests';
import SearchFriend from './search-friend';

export default function AddFriend() {
    const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const handleClearSearch = () => {
        setSearchQuery('')
    }
    return (
        <Dialog open={isAddFriendModalOpen} onOpenChange={setIsAddFriendModalOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <UserPlus className="h-5 w-5" />
                    <span className="sr-only">Add Friend</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <div className="overflow-hidden flex flex-col">

                    <DialogHeader className='text-xl font-semibold mb-4 px-2'>Add Friends</DialogHeader>
                    <div className="relative mb-6">
                        <Input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className=" w-[97%] mx-auto pl-8 pr-8 py-2 border-gray-300 rounded-lg"
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

                <ScrollArea className="flex-grow px-2 pb-6">
                    {searchQuery ? (
                        <SearchFriend searchQuery={searchQuery} />
                    ) : (
                        <FriendRequests />
                    )}
                </ScrollArea>

            </DialogContent>
        </Dialog>
    )
}
