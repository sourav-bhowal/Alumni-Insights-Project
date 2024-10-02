import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowBigLeft, Menu } from "lucide-react";
import {
  Channel,
  ChannelHeader,
  ChannelHeaderProps,
  MessageInput,
  MessageList,
  Window,
} from "stream-chat-react";
// import { EmojiPicker } from "stream-chat-react/emojis";

// Chat channel props
interface ChatChannelProps {
  open: boolean;
  openSidebar: () => void;
}

// Chat Channel component
export default function ChatChannel({ open, openSidebar }: ChatChannelProps) {
  return (
    <div className={cn("w-full md:block", !open && "hidden")}>
      <Channel >
        <Window>
          <CustomChannelHeader openSidebar={openSidebar} />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </div>
  );
}

// custom channel header props
interface CustomChannelHeaderProps extends ChannelHeaderProps {
  openSidebar: () => void;
}

// custom channel header
function CustomChannelHeader({
  openSidebar,
  ...props
}: CustomChannelHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-full p-2 md:hidden ">
        <Button size={"icon"} variant="ghost" onClick={openSidebar}>
          <Menu className="size-5" />
        </Button>
      </div>
      <ChannelHeader {...props} />
    </div>
  );
}
