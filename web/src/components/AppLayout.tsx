import React from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatList from '@/components/sidebar/ChatList';
import ProfileCard from '@/components/sidebar/ProfileCard';
import AddFriendModal from '@/components/sidebar/modal/AddFriendModal';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const Sidebar = (() => (
        <div className="w-80 border-r border-border hidden md:block">
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
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

    return (
        <main className='m-auto max-w-[80rem] p-3 flex h-screen bg-background'>
            <Sidebar />
            {children}
        </main>
    );
}
