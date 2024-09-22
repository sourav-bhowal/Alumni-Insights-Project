import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getReferJobData, ReferJobPage } from "@/utils/types";

// GET REFER JOBS
export async function GET(req: NextRequest) {
  try {
    // SEARCH PARAMS
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const q = req.nextUrl.searchParams.get("q") || "";
    // SEARCH STRING
    const searchString = q
      ?.split(" ")
      .filter((word) => word.length > 0)
      .join(" & ");
    const workType = req.nextUrl.searchParams.get("workType") || "";
    const location = req.nextUrl.searchParams.get("location") || "";
    const jobType = req.nextUrl.searchParams.get("jobType") || "";
    const salary = req.nextUrl.searchParams.get("salary") || "";

    // PAGE SIZE
    const pageSize = 5;

    // GET USER FROM SESSION
    const { user } = await validateRequest();

    // CHECK IF USER EXISTS
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // BUILD FILTER CONDITIONS
    let filters: any = {
      ...(searchString && {
        title: { contains: searchString, mode: "insensitive" },
      }),
      ...(workType && { workType }),
      ...(location && { location }),
      ...(jobType && { jobType }),
    };
    // Handle salary range
    if (salary) {
      const [minSalary, maxSalary] = salary.split("-");
      filters.salary = {
        ...(minSalary && { gte: minSalary }),
        ...(maxSalary && { lte: maxSalary }),
      };
    }

    // GET POSTS
    const referJobs = await prisma.referJob.findMany({
      where: filters,
      include: getReferJobData(user.id),
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    // NEXT PAGE
    const nextCursor =
      referJobs.length > pageSize ? referJobs[pageSize].id : null;

    // RETURN RESPONSE
    return Response.json({
      referJobs: referJobs.slice(0, pageSize),
      nextCursor,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
