'use client'
import React, { useEffect, useRef } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSocket } from '@/Providers/SocketProvider'

import { useSession } from 'next-auth/react';
import { Message } from '@/types';

export default function Messages({ chat }: { chat: Message[] }) {
    const { messages, loadMessages } = useSocket();
    const { data } = useSession();
    const userId = data?.user.id
    const chatContainerRef = useRef<null | HTMLDivElement>(null);
    const scrollToBottom = () => {
        chatContainerRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    useEffect(() => {
        loadMessages(chat);
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages])
    return (
        <ScrollArea className="flex-1 p-4">
            <div className="space-y-4" >
                {messages?.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.senderId === userId ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`rounded-lg px-4 py-2 max-w-[70%] ${message.senderId === userId ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                }`}
                        >
                            {message.content}
                        </div>
                    </div>
                ))}
            </div>
            <div ref={chatContainerRef} />
        </ScrollArea>
    )
}
