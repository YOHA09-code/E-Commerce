"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Send,
  Search,
  User,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Conversation {
  id: string;
  vendorId?: string;
  vendor?: {
    id: string;
    businessName: string;
  };
  userId?: string;
  user?: {
    id: string;
    name: string;
  };
  lastMessage?: {
    content: string;
    createdAt: string;
  };
  unreadCount?: number;
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin?callbackUrl=/messages");
      return;
    }

    // In production, fetch from API
    setTimeout(() => {
      setConversations([
        {
          id: "1",
          vendorId: "vendor-1",
          vendor: {
            id: "vendor-1",
            businessName: "Ethiopian Coffee Co.",
          },
          lastMessage: {
            content: "Thank you for your order!",
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
          unreadCount: 2,
        },
        {
          id: "2",
          vendorId: "vendor-2",
          vendor: {
            id: "vendor-2",
            businessName: "Habesha Fashion",
          },
          lastMessage: {
            content: "Your order has been shipped.",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
          unreadCount: 0,
        },
      ]);
      setLoading(false);
    }, 500);
  }, [session, router]);

  const filteredConversations = conversations.filter((conv) =>
    conv.vendor?.businessName
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className="text-muted-foreground">
          Contact vendors and manage your conversations
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No conversations found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredConversations.map((conv) => (
                    <Link key={conv.id} href={`/messages/${conv.id}`}>
                      <motion.div
                        className="p-4 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <User className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium truncate">
                                {conv.vendor?.businessName || conv.user?.name}
                              </p>
                              {conv.unreadCount && conv.unreadCount > 0 && (
                                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                                  {conv.unreadCount}
                                </span>
                              )}
                            </div>
                            {conv.lastMessage && (
                              <>
                                <p className="text-sm text-muted-foreground truncate">
                                  {conv.lastMessage.content}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {formatDistanceToNow(
                                    new Date(conv.lastMessage.createdAt),
                                    { addSuffix: true }
                                  )}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Message Thread - Placeholder */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Select a conversation to view messages</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

