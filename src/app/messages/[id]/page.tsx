"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Send, ArrowLeft, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id: string;
  content: string;
  senderId: string;
  sender?: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export default function MessageThreadPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin?callbackUrl=/messages");
      return;
    }

    // In production, fetch messages from API
    // Polling fallback - in production, use WebSockets or Server-Sent Events
    const fetchMessages = async () => {
      setTimeout(() => {
        setMessages([
          {
            id: "1",
            content: "Hello, I'm interested in your product.",
            senderId: session.user?.id || "user-1",
            sender: {
              id: session.user?.id || "user-1",
              name: session.user?.name || "You",
            },
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: "2",
            content: "Thank you for your interest! How can I help you?",
            senderId: "vendor-1",
            sender: {
              id: "vendor-1",
              name: "Ethiopian Coffee Co.",
            },
            createdAt: new Date(Date.now() - 82800000).toISOString(),
          },
        ]);
        setLoading(false);
      }, 500);

      // Set up polling (in production, use WebSockets)
      const interval = setInterval(() => {
        // Poll for new messages
      }, 5000);

      return () => clearInterval(interval);
    };

    fetchMessages();
  }, [session, router, params.id]);

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    // In production, send via API
    setTimeout(() => {
      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          content: newMessage,
          senderId: session?.user?.id || "user-1",
          sender: {
            id: session?.user?.id || "user-1",
            name: session?.user?.name || "You",
          },
          createdAt: new Date().toISOString(),
        },
      ]);
      setNewMessage("");
      setSending(false);
    }, 300);
  };

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link href="/messages">
          <AnimatedButton variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Messages
          </AnimatedButton>
        </Link>
      </motion.div>

      <Card className="h-[600px] flex flex-col">
        {/* Header */}
        <div className="border-b p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">Ethiopian Coffee Co.</p>
            <p className="text-xs text-muted-foreground">Vendor</p>
          </div>
        </div>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.senderId === session?.user?.id;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      isOwn
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {formatDistanceToNow(new Date(msg.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
        </CardContent>

        {/* Input */}
        <div className="border-t p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
              disabled={sending}
            />
            <AnimatedButton type="submit" disabled={sending || !newMessage.trim()}>
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </AnimatedButton>
          </form>
        </div>
      </Card>
    </div>
  );
}

