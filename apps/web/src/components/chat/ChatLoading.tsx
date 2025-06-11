'use client'
import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"

export default function ChatLoading() {
    return (

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

    )
}