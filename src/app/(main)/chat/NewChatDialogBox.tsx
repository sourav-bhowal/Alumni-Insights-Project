import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { DefaultStreamChatGenerics, useChatContext } from "stream-chat-react";
import { useSession } from "@/context/SessionProvider";
import { useState } from "react";
import useDobouncedValue from "@/hooks/useDobouncedValue";
import { UserResponse } from "stream-chat";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, Loader2, SearchIcon } from "lucide-react";
import UserAvatar from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Props for new chat dialog box
interface NewChatDialogBoxProps {
  onOpenChange: (open: boolean) => void;
  onChatCreated: () => void;
}

// NEW CHAT DIALOG BOX COMPONENT
export default function NewChatDialogBox({
  onOpenChange,
  onChatCreated,
}: NewChatDialogBoxProps) {
  // use chat hook from stream
  const { client, setActiveChannel } = useChatContext();

  // toast
  const { toast } = useToast();

  // get user from session
  const { user: loggedInUser } = useSession();

  // input state for search stream users
  const [searchInput, setSearchInput] = useState("");

  // group chat name state
  const [groupName, setGroupName] = useState("");

  // state for group image
  // const [groupImage, setGroupImage] = useState<File | undefined>();

  // debounced search input state for stream users
  const debouncedSearchInput = useDobouncedValue(searchInput, 250);

  // users of stream in an array
  const [selectedStreamUsers, setSelectedStreamUsers] = useState<
    UserResponse<DefaultStreamChatGenerics>[]
  >([]);

  // react query to get stream users
  const { data, isFetching, isError, isSuccess } = useQuery({
    queryKey: ["stream-users", debouncedSearchInput],
    queryFn: async () =>
      // get stream users
      client.queryUsers(
        {
          id: { $ne: loggedInUser?.id }, //  exclude logged in user
          role: { $ne: "admin" }, //  exclude admins
          ...(debouncedSearchInput //  search input is not empty
            ? {
                $or: [
                  { name: { $autocomplete: debouncedSearchInput } },
                  { username: { $autocomplete: debouncedSearchInput } },
                ],
              }
            : {}),
        },
        { name: 1, username: 1 }, //  order by name and username
        { limit: 10 }, //  limit to 10 results
      ),
  });

  // Mutation to create new chat
  const mutation = useMutation({
    mutationFn: async () => {
      // create new chat
      const channel = client.channel("messaging", {
        members: [
          loggedInUser?.id,
          ...selectedStreamUsers.map((user) => user.id),
        ],
        name:
          selectedStreamUsers.length > 1
            ? groupName
            : selectedStreamUsers[0].name + " & " + loggedInUser?.username,
        // image: groupImage ? groupImage : null,
      });
      // ceate channel
      await channel.create();

      // return channel
      return channel;
    },
    // on success do this
    onSuccess: (channel) => {
      setActiveChannel(channel);
      onChatCreated();
      onOpenChange(false);
    },
    // on error do this
    onError(error) {
      console.log(error);
      toast({
        title: "Error",
        description:
          `${selectedStreamUsers.length > 1 && groupName.length === 0 ? "Group name is required" : ""}` ||
          "Something went wrong. Please try again.",

        variant: "destructive",
      });
    },
  });

  return (
    <>
      {/* NEW CHAT DIALOG BOX */}
      <Dialog open onOpenChange={onOpenChange}>
        <DialogContent className="bg-card p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>New Chat</DialogTitle>
          </DialogHeader>
          <section>
            <div className="group relative">
              <SearchIcon className="absolute left-5 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground group-focus-within:text-primary" />
              <input
                type="text"
                placeholder="Search for users..."
                className="h-12 w-full pe-4 ps-14 focus:outline-none"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <div className="h-96 overflow-auto">
              {/* show stream users here */}
              {isSuccess &&
                data.users.map((user) => (
                  <StreamUser
                    key={user.id}
                    user={user}
                    selected={selectedStreamUsers.some((u) => u.id === user.id)} // check if user is selected
                    onClick={() => {
                      // add user to stream users
                      setSelectedStreamUsers(
                        (
                          prev, //  filter out if user is already selected
                        ) =>
                          prev.some((u) => u.id === user.id)
                            ? prev.filter((u) => u.id !== user.id)
                            : [...prev, user], //  add user if not selected
                      );
                    }}
                  />
                ))}
              {/* If there are users */}
              {isSuccess && data.users.length > 0 && (
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Select users to start a chat.
                </p>
              )}
              {/* If no stream users */}
              {isSuccess && !data.users.length && (
                <p className="my-3 text-center text-muted-foreground">
                  No users found. Try searching again.
                </p>
              )}
              {/* If stream users are loading */}
              {isFetching && <Loader2 className="mx-auto my-3 animate-spin" />}
              {/* If stream users are error */}
              {isError && (
                <p className="my-3 text-center text-destructive">
                  Something went wrong. Try again later.
                </p>
              )}
            </div>
          </section>
          {/* BUTTON TO CREATE CHAT */}
          <DialogFooter className="gap-2 px-6 pb-6">
            {/* If multiple stream users are selected give option to enter group name */}
            {selectedStreamUsers.length > 1 && (
              <div className="flex w-full items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Enter a name for your group"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="bg-muted/60"
                />
                {/* <Input
                  type="file"
                  onChange={(e) => setGroupImage(e.target.files?.[0])}
                  className="bg-muted/60 w-[20%]"
                  title="Group Image"
                /> */}
              </div>
            )}
            <Button
              type="submit"
              disabled={
                !selectedStreamUsers.length ||
                mutation.isPending ||
                (selectedStreamUsers.length > 1 && groupName.length === 0)
              }
              onClick={() => mutation.mutate()}
            >
              {mutation.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Create Chat"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// stream user component props
interface StreamUserProps {
  user: UserResponse<DefaultStreamChatGenerics>;
  selected: boolean;
  onClick: () => void;
}

// STREAM USER COMPONENT
function StreamUser({ user, selected, onClick }: StreamUserProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between px-4 py-2.5 transition-colors hover:bg-muted/50"
    >
      <div className="flex items-center gap-3">
        <UserAvatar avatarUrl={user.image} />
        <p className="flex flex-col text-start">
          <span className="font-bold">{user.name}</span>
          <span className="text-muted-foreground">@{user.username}</span>
        </p>
      </div>
      {selected && (
        <div className="flex items-center gap-3">
          <button className="rounded-2xl border-2 border-primary p-1.5 text-center text-sm font-semibold text-primary">
            selected
          </button>
          <Check className="size-5 text-primary" />
        </div>
      )}
    </button>
  );
}
