import React from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatList from '@/components/sidebar/ChatList';
import ProfileCard from '@/components/sidebar/ProfileCard';
import AddFriendModal from '@/components/sidebar/modal/AddFriendModal';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className='m-auto max-w-[80rem] flex h-screen bg-background'>
            <div className='hidden md:block'>
                <Sidebar />
            </div>
            {children}
        </main>
    );
}

export const Sidebar = (() => (
    <div className="md:w-80 w-screen border-r border-border">
        <div className="p-4 space-y-4">
            <div className="flex items-center justify-between mr-4 md:mr-1">
                <ProfileCard />
                <AddFriendModal />
            </div>
            <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search" className="pl-8" />
            </div>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
            <ChatList />
        </ScrollArea>
    </div>
));
