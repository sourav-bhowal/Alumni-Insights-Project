import { StreamChat } from "stream-chat";
import { useSession } from "@/context/SessionProvider";
import { useEffect, useState } from "react";
import { kyInstance } from "@/utils/ky";

// CHAT CLIENT INITIALIZE HOOK
export default function useInitializeChatClient() {
  // get user
  const { user: loggedInUser } = useSession();

  // state for chat client
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);

  // initialize chat client
  useEffect(() => {
    // client
    const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_KEY!);

    // connect client
    client
      .connectUser(
        {
          id: loggedInUser?.id,
          username: loggedInUser?.username,
          name: loggedInUser?.displayName,
          image: loggedInUser?.avatarUrl,
        },
        // get token
        async () =>
          kyInstance
            .get("/api/get-token")
            .json<{ token: string }>()
            .then((data) => data.token),
      )
      // catch error
      .catch((error) => {
        console.log("Failed to connect user", error);
      })
      // set client
      .then(() => setChatClient(client));

    // return to disconnect user
    return () => {
      setChatClient(null);
      client
        .disconnectUser()
        .catch((error) => console.log("Failed to disconnect user", error))
        .then(() => console.log("Disconnected user"));
    };
  }, [
    loggedInUser.id,
    loggedInUser.username,
    loggedInUser.displayName,
    loggedInUser.avatarUrl,
  ]);

  // return chat client
  return chatClient;
}
