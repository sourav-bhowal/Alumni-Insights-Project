import { Metadata } from "next";
import Chat from "./Chat";

export const metadata: Metadata = {
  title: "Messages",
};

// Chat page
export default function ChatPage() {
  return <Chat />;
}
