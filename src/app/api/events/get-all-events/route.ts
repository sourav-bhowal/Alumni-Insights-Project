import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getEventData, EventPage } from "@/utils/types";
import { NextRequest } from "next/server";

// GET ALL EVENTS
export async function GET(req: NextRequest) {
  try {
    // SEARCH PARAMS
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    // PAGE SIZE
    const pageSize = 10;

    // GET USER FROM SESSION
    const { user } = await validateRequest();

    // CHECK IF USER EXISTS
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // GET POSTS
    const events = await prisma.event.findMany({
      include: getEventData(user.id),
      orderBy: {
        date: "desc",
      },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    // NEXT PAGE
    const nextCursor = events.length > pageSize ? events[pageSize].id : null;

    // DATA TO RETURN
    const data: EventPage = {
      events: events.slice(0, pageSize),
      nextCursor,
    };

    // RETURN POST
    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error." }, { status: 500 });
  }
}
