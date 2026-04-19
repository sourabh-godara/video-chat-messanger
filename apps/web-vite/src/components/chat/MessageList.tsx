import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatType } from "@/types";

interface MessageListProps {
  userId: string;
  messages: ChatType["messages"];
}
export default function MessageList({ userId, messages }: MessageListProps) {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages?.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === userId ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`rounded-lg px-4 py-2 max-w-[70%] ${message.senderId === userId
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
                }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
