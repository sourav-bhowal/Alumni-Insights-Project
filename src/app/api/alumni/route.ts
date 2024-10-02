import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { getUserData } from "@/utils/types";
import { NextRequest } from "next/server";

// GET USER
export async function GET(req: NextRequest) {
  try {
    // SEARCH PARAMS
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const q = req.nextUrl.searchParams.get("q") || "";
    const domain = req.nextUrl.searchParams.get("domain") || "";
    const location = req.nextUrl.searchParams.get("location") || "";
    const fieldOfStudy = req.nextUrl.searchParams.get("fieldOfStudy") || "";

    // SEARCH STRING
    const searchString = q
      ?.split(" ")
      .filter((word) => word.length > 0)
      .join(" & ");

    // PAGE SIZE
    const pageSize = 5;

    // GET USER FROM SESSION
    const { user } = await validateRequest();

    // CHECK IF USER EXISTS
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // FILTERS
    const filters: any = {
      ...(searchString && {
        displayName: { contains: searchString, mode: "insensitive" },
      }),
      ...(domain && { domain }),
      ...(location && { location }),
      ...(fieldOfStudy && { fieldOfStudy }),
    };

    // GET USERS
    const alumni = await prisma.user.findMany({
      where: {
        isAlumni: true,
        ...filters,
      },
      include: getUserData(user.id),
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    // NEXT CURSOR
    const nextCursor = alumni.length > pageSize ? alumni[pageSize].id : null;

    // RESPONSE
    return Response.json(
      {
        users: alumni.slice(0, pageSize),
        nextCursor,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
