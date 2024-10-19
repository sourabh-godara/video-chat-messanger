'use client'
import React from 'react'
import { io } from 'socket.io-client'

interface ISocketContext {
    sendMessage: (msg: string) => any;
}
interface SocketProviderProps {
    children?: React.ReactNode
}
export const SocketContext = React.createContext<ISocketContext | null>(null);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const sendMessage: ISocketContext['sendMessage'] = (msg) => {
        console.log("Message: ", msg)
    }
    return (
        <SocketContext.Provider value={{ sendMessage }}>
            {children}
        </SocketContext.Provider>
    )
}