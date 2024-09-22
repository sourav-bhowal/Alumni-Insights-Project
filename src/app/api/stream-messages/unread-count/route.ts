import streamServer from "@/lib/stream";
import { validateRequest } from "@/lib/auth";
import { StreamMessageUnreadCount } from "@/utils/types";

// GET ROUTE to get unread stream msgs
export async function GET() {
  try {
    // get user from server
    const { user: loggedInUser } = await validateRequest();

    // if not logged in
    if (!loggedInUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    // get unread count from stream server
    const { total_unread_count } = await streamServer.getUnreadCount(
      loggedInUser.id,
    );

    // data to return
    const data: StreamMessageUnreadCount = {
      unreadCount: total_unread_count,
    };

    // return data
    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
