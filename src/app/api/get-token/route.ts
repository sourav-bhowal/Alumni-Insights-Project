import streamServer from "@/lib/stream";
import { validateRequest } from "@/lib/auth";

// GET TOKEN FOR STREAM CHAT
export async function GET() {
  try {
    // get user
    const { user: loggedInUser } = await validateRequest();

    console.log("loggedInUser", loggedInUser?.id);

    // no user
    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Expiry time in seconds (3600 = 1 hour)
    const expiryTime = Math.floor(Date.now() / 1000) + 3600;

    // Issued at time in seconds
    const issuedAtTime = Math.floor(Date.now() / 1000) - 60;

    // Generate token using stream server
    const token = streamServer.createToken(
      loggedInUser.id,
      expiryTime,
      issuedAtTime,
    );

    // Return token
    return Response.json({ token });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
