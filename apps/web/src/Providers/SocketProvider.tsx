"use client";
import { useSession } from 'next-auth/react'
import { v4 as uuidv4 } from 'uuid';
import React, { useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { ChatType, Message } from "@/types";
import { decryptMessage, encrypt } from '@/app/lib/Encrypt';
const SOCKET_URL = process.env.NODE_ENV == 'production' ? process.env.NEXT_PUBLIC_SOCKET_SERVER : 'http://localhost:8530';

interface SocketProviderProps {
    children?: React.ReactNode;
}

export interface ISocketContext {
    loadMessages: (messages: ChatType['messages']) => void;
    sendMessage: (message: string, receiverId: string, roomId: string) => void;
    messages: ChatType['messages'];
    socket: Socket | undefined;
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
    const [messages, setMessages] = useState<ChatType['messages']>([]);

    const loadMessages: ISocketContext["loadMessages"] = (messages) => {
        const decryptedMessages = messages.map((msg) => ({
            ...msg,
            content: decryptMessage(msg.content),
        }))
        setMessages(decryptedMessages)
    }
    const sendMessage: ISocketContext["sendMessage"] = useCallback(
        async (message, receiverId, roomId) => {

            if (!socket || !data?.user.id) {
                console.error("Something Went Wrong");
                return;
            }

            try {
                const encryptedMessage = await encrypt(message);
                const newMessage = {
                    id: uuidv4(),
                    senderId: data.user.id,
                    receiverId: receiverId,
                    content: encryptedMessage,
                    createdAt: new Date(),
                    roomId: roomId
                }
                socket.emit("event:message", newMessage);

            } catch (error) {
                console.error("Failed to encrypt or send message:", error);
            }
        },
        [socket, data?.user.id]
    );

    const onMessageRec = useCallback(async (message: Message) => {
        message['content'] = await decryptMessage(message.content);
        setMessages((prevMessages) => [...prevMessages, message]);
    }, []);

    useEffect(() => {
        if (status !== 'authenticated' || !data?.user.id) return;

        const _socket = io(SOCKET_URL);
        setSocket(_socket);

        _socket.on("receive-message", onMessageRec);
        _socket.on("connect_error", (err) => {
            console.error("Socket connection error:", err);
        });

        return () => {
            _socket.off("receive-message", onMessageRec);
            _socket.disconnect();
            setSocket(undefined);
        };
    }, [status, data?.user.id]);

    return (
        <SocketContext.Provider value={{ sendMessage, messages, loadMessages, socket }}>
            {children}
        </SocketContext.Provider>
    );
};
