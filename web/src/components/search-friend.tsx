'use client'
import React, { useCallback, useEffect, useState } from 'react'
import searchUser from '../app/actions/search-action';
import { FriendRequestsType, User } from '@/types';
import { useSession } from 'next-auth/react';
import SearchResultCard from './search-result-card';
import LoadingSpinner from './ui/loading-spinner';

interface props {
    searchQuery: string,
    friendRequests: FriendRequestsType
}
export default function SearchFriend({ friendRequests, searchQuery }: props) {
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | undefined>()
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();

    const handleSearch = useCallback(async () => {
        try {
            setLoading(true);
            const users = await searchUser(searchQuery, session?.user.id);
            setFilteredUsers(users);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Something went wrong.');
        } finally {
            setLoading(false);
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

            {loading ? <LoadingSpinner className='w-full mt-14 text-center' text={'Searching'} /> : <SearchResultCard users={filteredUsers} friendRequests={friendRequests} />}

            {!loading && !filteredUsers.length && (
                <p className="text-center text-gray-500 mt-4">No users found</p>
            )}
        </div>
    )
}
