import * as React from "react"
import ChatLoading from "@/components/chat/ChatLoading"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="flex-1 flex flex-col">
            <header className="border-b border-border p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                </div>
            </header>
            <ChatLoading />
            <footer className="border-t border-border p-4">
                <form className="flex space-x-2">
                    <Skeleton className="flex-1 h-10" />
                    <Skeleton className="h-10 w-10" />
                </form>
            </footer>
        </div>
    )
}