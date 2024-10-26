'use client'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Search, UserPlus, X } from 'lucide-react'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'
import FriendRequests from './friend-requests'
import SearchFriend from './search-friend'
import { fetchFriendRequests } from '@/app/actions/friend-action'
import { FriendRequestsType, ReceivedFriendRequests } from '@/types'
import { DialogTitle } from '@radix-ui/react-dialog'

export default function AddFriend() {
    const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [error, setError] = useState<string | undefined>()
    const [friendRequests, setFriendRequests] = useState<FriendRequestsType>({ receivedRequests: [], sentRequests: [] })

    const handleUpdateReceivedRequests = (updatedRequests: ReceivedFriendRequests[]) => {
        setFriendRequests({
            ...friendRequests,
            receivedRequests: updatedRequests,
        });
    };
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await fetchFriendRequests()
                setFriendRequests(res)
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Something went wrong.');
            }
        }
        fetchRequests()
    }, [])
    return (
        <Dialog open={isAddFriendModalOpen} onOpenChange={setIsAddFriendModalOpen}>
            <DialogTrigger asChild>
                <Button variant='ghost' size='icon'>
                    <UserPlus className='h-5 w-5' />
                    <span className='sr-only'>Add Friend</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <div className='flex flex-col overflow-hidden'>
                    <DialogTitle className='mb-4 px-2 text-xl font-semibold'>
                        Add Friends
                    </DialogTitle>
                    <div className='relative mb-6'>
                        <Input
                            type='text'
                            placeholder='Search users...'
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className=' mx-auto w-[97%] rounded-lg border-gray-300 py-2 pl-8 pr-8'
                        />
                        <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400' />
                        {searchQuery && (
                            <Button
                                size='sm'
                                variant='ghost'
                                onClick={() => setSearchQuery('')}
                                className='absolute right-2 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600'
                            >
                                <X className='h-5 w-5' />
                            </Button>
                        )}
                    </div>
                </div>

                {error ? (
                    <p className="text-red-600">{error}</p>
                ) : (
                    <ScrollArea className='h-64 flex-grow px-2 pb-3'>
                        {searchQuery ? (
                            <SearchFriend
                                friendRequests={friendRequests}
                                searchQuery={searchQuery}
                            />
                        ) : (
                            <FriendRequests
                                onUpdateReceivedRequests={handleUpdateReceivedRequests}
                                receivedRequests={friendRequests.receivedRequests}
                            />
                        )}
                    </ScrollArea>
                )}
            </DialogContent>
        </Dialog>
    )
}
