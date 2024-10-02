"use client";
import { Button } from "@/components/ui/button";
import { kyInstance } from "@/utils/ky";
import { StreamMessageUnreadCount } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

// PROPS
interface UnreadStreamMessagesCountButtonProps {
  initialState: StreamMessageUnreadCount;
}

// UNREAD MESSAGES COUNT BUTTON
export default function UnreadStreamMessagesCountButton({
  initialState,
}: UnreadStreamMessagesCountButtonProps) {
  // MESSAGE UNREAD COUNT QUERY
  const { data } = useQuery({
    queryKey: ["stream-messages-unread-count"],
    queryFn: () =>
      kyInstance
        .get("/api/stream-messages/unread-count")
        .json<StreamMessageUnreadCount>(),
    initialData: initialState,
    refetchInterval: 10 * 1000,     // 10 seconds
  });

  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-3"
      title="Messages"
      asChild
    >
      <Link href="/messages">
        <div className="relative">
          <MessageCircle />
          {!!data?.unreadCount && (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
              {data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden lg:inline">Messages</span>
      </Link>
    </Button>
  );
}
