"use client";
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/Providers/SocketProvider";
import { Input } from "@/components/ui/input";

interface ChatProps {
  roomId: string;
  sendMessage: (newMessage: string, roomId: string) => void;
  isJoined: boolean;
}

export function ChatInput({
  roomId,
  sendMessage,
  isJoined = false,
}: ChatProps) {
  const [messageContent, setMessageContent] = useState("");

  return (
    <>
      <footer className="border-t border-border p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!isJoined || !messageContent.trim()) return;
            sendMessage(messageContent, roomId);
            setMessageContent("");
          }}
          className="flex space-x-2"
        >
          <Input
            placeholder="Type your message..."
            autoComplete="off"
            aria-label="Chat message input"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={!isJoined || !messageContent.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
        {!isJoined && (
          <p className="text-sm text-gray-500 mt-2">Connecting to chat...</p>
        )}
      </footer>
    </>
  );
}
