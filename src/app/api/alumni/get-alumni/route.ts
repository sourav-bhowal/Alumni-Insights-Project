import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { NextRequest } from "next/server";
import { AlumniData } from "@/utils/types";
import { redis } from "@/lib/redis";
import { FilterMentors } from "@/lib/filterValidations";

// GET USER
export async function GET(req: NextRequest) {
  try {
    // SEARCH PARAMS
    const q = req.nextUrl.searchParams.get("q") || "";
    const domain = req.nextUrl.searchParams.get("domain") || "";
    const location = req.nextUrl.searchParams.get("location") || "";
    const fieldOfStudy = req.nextUrl.searchParams.get("fieldOfStudy") || "";
    const page = req.nextUrl.searchParams.get("page") || "";
    const perPage = req.nextUrl.searchParams.get("perPage") || "";

    // SEARCH STRING
    const searchString = q
      ?.split(" ")
      .filter((word) => word.length > 0)
      .join(" & ");

    // TAKE & SKIP
    const take = Number(perPage);
    const skip = (Number(page) - 1) * Number(perPage);

    // GET USER FROM SESSION
    const { user } = await validateRequest();

    // CHECK IF USER EXISTS
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // FILTERS
    const filters: FilterMentors = {
      ...(searchString && {
        displayName: { contains: searchString, mode: "insensitive" },
      }),
      ...(domain && { domain }),
      ...(location && { location }),
      ...(fieldOfStudy && { fieldOfStudy }),
    };

    // CHECK REDIS CACHE FOR ALUMNI
    const cachedAlumni = await redis.get(
      `alumni:${JSON.stringify(filters)}${take}${skip}`,
    );

    // CHECK IF CACHED ALUMNI EXISTS
    if (cachedAlumni) {
      console.log("Cached Alumni");
      return Response.json(JSON.parse(cachedAlumni), { status: 200 });
    }

    // GET ALUMNI USERS
    const alumni = await prisma.user.findMany({
      take,
      skip,
      where: {
        isAlumni: true,
        ...filters,
      },
      orderBy: { createdAt: "desc" },
    });
    console.log("DB alumni");

    // COUNT ALUMNI USERS
    const alumnicount = await prisma.user.count({
      where: {
        isAlumni: true,
        ...filters,
      },
    });

    // Pagination
    const totalPages = Math.ceil(alumni.length / Number(perPage));
    // Check if there are more mentors
    const hasNextPage = skip + take < alumnicount;

    // DATA OBJECT
    const data: AlumniData = {
      alumni,
      totalPages,
      hasNextPage,
    };

    // SET ALUMNI TO REDIS CACHE
    await redis.set(
      `alumni:${JSON.stringify(filters)}${take}${skip}`,
      JSON.stringify({alumni, totalPages, hasNextPage}),
      "EX",
      60 * 5, // 5 minutes
    );

    // RETURN RESPONSE
    return Response.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
