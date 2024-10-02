import {
  ChannelList,
  ChannelPreviewMessenger,
  ChannelPreviewUIComponentProps,
  useChatContext,
} from "stream-chat-react";
import { useSession } from "@/context/SessionProvider";
import { Button } from "@/components/ui/button";
import { MailPlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import NewChatDialogBox from "./NewChatDialogBox";
import { useQueryClient } from "@tanstack/react-query";
import { Channel } from "stream-chat";

// ChatSideBar Props
interface ChatSideBarProps {
  open: boolean;
  onClose: () => void;
}

// CHAT SIDE BAR COMPONENT
export default function ChatSideBar({ onClose, open }: ChatSideBarProps) {
  // get user from session
  const { user: loggedInUser } = useSession();

  // query client
  const queryClient = useQueryClient();

  // get channel from chat context
  const { channel } = useChatContext();
  

  // use Effect to invalidate unread msg count
  useEffect(() => {
    if (channel?.id) {
      queryClient.invalidateQueries({
        queryKey: ["stream-messages-unread-count"],
      });
    }
  }, [channel?.id, queryClient]);

  // Channel Preview
  const ChannelPreviewCustom = useCallback(
    (props: ChannelPreviewUIComponentProps) => (
      <ChannelPreviewMessenger
        {...props}
        onSelect={() => {
          props.setActiveChannel?.(props.channel, props.watchers);
          onClose();
        }}
      />
    ),
    [onClose],
  );

  return (
    <div
      className={cn(
        "size-full flex-col border-e md:flex md:w-72",
        open ? "flex" : "hidden",
      )}
    >
      <MenuHeader onClose={onClose} channel={channel} />
      <ChannelList
        filters={{
          type: "messaging",
          members: { $in: [loggedInUser?.id] },
        }}
        showChannelSearch
        options={{ state: true, presence: true, limit: 8 }}
        sort={{ last_message_at: -1 }}
        additionalChannelSearchProps={{
          searchForChannels: true,
          searchQueryParams: {
            channelFilters: {
              filters: {
                members: { $in: [loggedInUser?.id] },
              },
            },
          },
        }}
        Preview={ChannelPreviewCustom}
      />
    </div>
  );
}

// interface menu header
interface MenuHeaderProps {
  onClose: () => void;
  channel: Channel | undefined;
}

// menu header
function MenuHeader({ onClose, channel }: MenuHeaderProps) {
  // state for chat dialog
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3 p-2">
        <div className="h-full md:hidden">
          {channel && (
            <Button size={"icon"} variant="ghost" onClick={onClose}>
              <X className="size-5" />
            </Button>
          )}
        </div>
        <h1 className="me-auto text-xl font-bold md:ms-2">Messages</h1>
        {/* Start new chat */}
        <Button
          size={"icon"}
          variant="ghost"
          title="Start new chat"
          onClick={() => setShowNewChatDialog(true)}
        >
          <MailPlus className="size-5" />
        </Button>
      </div>
      {/* Start new chat dialog */}
      {showNewChatDialog && (
        <NewChatDialogBox
          onOpenChange={setShowNewChatDialog}
          onChatCreated={() => {
            setShowNewChatDialog(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
