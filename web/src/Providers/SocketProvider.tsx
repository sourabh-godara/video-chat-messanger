"use client";
import { useSession } from 'next-auth/react'
import { v4 as uuidv4 } from 'uuid';
import React, { useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { ChatType } from "@/types";
import { getUserIdFromSession } from '@/lib';
const SOCKET_URL = process.env.NODE_ENV == 'production' ? process.env.NEXT_PUBLIC_SOCKET_SERVER : 'http://localhost:8530';

interface SocketProviderProps {
    children?: React.ReactNode;
}

interface ISocketContext {
    loadMessages: (messages: ChatType['messages']) => any;
    sendMessage: (message: string, receiverId: string) => any;
    messages: ChatType['messages'];
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
    const state = useContext(SocketContext);
    if (!state) throw new Error(`state is undefined`);

    return state;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const { data, status } = useSession();
    const [socket, setSocket] = useState<Socket>();
    const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatType['messages']>([]);

    const loadMessages: ISocketContext["loadMessages"] = (messages) => {
        setMessages(messages)
    }
    const sendMessage: ISocketContext["sendMessage"] = useCallback(
        (message, receiverId) => {
            console.log("Sending Message...")
            const trimmedMessage = message.trim();
            if (!trimmedMessage) return;
            if (socket && loggedInUserId) {
                let newMessage = {
                    id: uuidv4(),
                    senderId: loggedInUserId,
                    receiverId: receiverId,
                    content: trimmedMessage,
                    createdAt: new Date()
                }
                console.log('Message Sent: ', newMessage)
                setMessages(prevMessages => [...prevMessages, newMessage])
                socket.emit("event:message", newMessage);
            } else {
                console.error("User is not authenticated or socket is not connected.", { loggedInUserId });
            }
        },
        [socket, loggedInUserId]
    );

    const onMessageRec = useCallback((message: any) => {
        console.log('Message Received: ', message)
        setMessages(prevMessages => [...prevMessages, message])
    }, []);

    useEffect(() => {
        const _socket = io(SOCKET_URL);
        if (status === 'authenticated' && data?.user.id) {
            setLoggedInUserId(data.user.id)
        }
        setSocket(_socket);
        _socket.on(loggedInUserId!, onMessageRec);

        return () => {
            _socket.off("message", onMessageRec);
            _socket.disconnect();
            setSocket(undefined);
        };
    }, [loggedInUserId]);

    return (
        <SocketContext.Provider value={{ sendMessage, messages, loadMessages }}>
            {children}
        </SocketContext.Provider>
    );
};
