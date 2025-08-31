"use client";
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/Providers/SocketProvider";
import { Input } from "@/components/ui/input";

interface ChatProps {
  receiverId: string;
}

export function ChatInput({ receiverId }: ChatProps) {
  const { sendMessage } = useSocket();
  const [newMessage, setNewMessage] = useState("");

  return (
    <>
      <footer className="border-t border-border p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(newMessage, receiverId);
            setNewMessage("");
          }}
          className="flex space-x-2"
        >
          <Input
            placeholder="Type your message..."
            autoComplete="off"
            aria-label="Chat message input"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </footer>
    </>
  );
}
