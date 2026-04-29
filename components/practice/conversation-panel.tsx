"use client";

import { useEffect, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { getRealtimeSocket } from "@/lib/services/realtime";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Message {
  role: "coach" | "student";
  text: string;
}

export function ConversationPanel() {
  const [topic] = useState("Job interview warm-up");
  const [messages, setMessages] = useState<Message[]>([
    { role: "coach", text: "Hello. Tell me about a recent challenge you solved at work or school." }
  ]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const socket = getRealtimeSocket();
    if (!socket) return;

    socket.emit("practice:join", topic);
    socket.on("practice:coach", (payload) => {
      setMessages((current) => [...current, { role: "coach", text: payload.message }]);
    });

    return () => {
      socket.off("practice:coach");
    };
  }, [topic]);

  const sendMessage = async () => {
    if (!input) return;

    setMessages((current) => [...current, { role: "student", text: input }]);
    getRealtimeSocket()?.emit("practice:message", { topic, message: input });

    const response = await fetch("/api/ai/conversation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, message: input })
    });
    const data = await response.json();
    setMessages((current) => [...current, { role: "coach", text: data.reply }]);
    setInput("");
  };

  return (
    <Card className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold">Live AI Conversation</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Practice a realistic conversation with realtime prompts and targeted speaking tips.
        </p>
      </div>
      <div className="space-y-3 rounded-[28px] border border-border bg-background/50 p-5">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm ${
              message.role === "coach"
                ? "bg-primary/10 text-foreground"
                : "ml-auto bg-secondary/20 text-foreground"
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <Input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Type or dictate your response..." />
        <Button onClick={sendMessage}>
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
