import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
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
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {[...Array(5)].map((_, index) => (
                        <div
                            key={index}
                            className={`flex ${index % 2 === 0 ? "justify-end" : "justify-start"}`}
                        >
                            <Skeleton
                                className={`rounded-lg px-4 py-2 max-w-[70%] ${index % 2 === 0 ? "bg-primary" : "bg-muted"
                                    }`}
                            >
                                <div className="h-4 w-32" />
                            </Skeleton>
                        </div>
                    ))}
                </div>
            </ScrollArea>
            <footer className="border-t border-border p-4">
                <form className="flex space-x-2">
                    <Skeleton className="flex-1 h-10" />
                    <Skeleton className="h-10 w-10" />
                </form>
            </footer>
        </div>
    )
}