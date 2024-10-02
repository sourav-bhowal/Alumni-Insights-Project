"use client";
import { Loader2 } from "lucide-react";
import useInitializeChatClient from "./useInitializeChatClient";
import { Chat } from "stream-chat-react";
import ChatSideBar from "./ChatSideBar";
import ChatChannel from "./ChatChannel";
import { useTheme } from "next-themes";
import { useState } from "react";

// chat component
export default function ChatComponent() {
  // chat client
  const chatClient = useInitializeChatClient();

  // theme
  const { resolvedTheme } = useTheme();

  // state for sidebar
  const [sideBarOpen, setSideBarOpen] = useState(true);

  // if chat client is not initialized
  if (!chatClient) {
    return <Loader2 className="mx-auto my-3 animate-spin" />;
  }

  return (
    <main className="relative w-full overflow-hidden rounded-2xl bg-card shadow-sm">
      <div className="absolute bottom-0 top-0 flex w-full">
        <Chat
          client={chatClient}
          theme={
            resolvedTheme === "dark"
              ? "str-chat__theme-dark"
              : "str-chat__theme-light"
          }
        >
          <ChatSideBar
            open={sideBarOpen}
            onClose={() => setSideBarOpen(false)}
          />
          <ChatChannel
            open={!sideBarOpen}
            openSidebar={() => setSideBarOpen(true)}
          />
        </Chat>
      </div>
    </main>
  );
}
