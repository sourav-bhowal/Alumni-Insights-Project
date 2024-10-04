import MentorCard from "./MentorCard";
import { prisma } from "@/lib/prisma";
import { FilterMentors } from "@/lib/filterValidations";
import { Pagination } from "../../../../components/shared/pagination";
import { redis } from "@/lib/redis";
import { User } from "@prisma/client";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

// INTERFACE FOR MENTOR LIST
interface MentorsSectionProps {
  filterValues: FilterMentors;
}

// MENTORS SECTION
async function MentorsSection({
  filterValues: { q, location, domain, fieldOfStudy, page, perPage },
}: MentorsSectionProps) {
  // search string
  const searchString = q
    ?.split(" ")
    .filter((word) => word.length > 0)
    .join(" & ");

  // FILTERS
  const filters: FilterMentors = {
    ...(searchString && {
      OR: [
        { username: { contains: searchString, mode: "insensitive" } },
        { bio: { contains: searchString, mode: "insensitive" } },
      ],
    }),
    ...(location && { location }),
    ...(domain && { domain }),
    ...(fieldOfStudy && { fieldOfStudy }),
  };

  // TAKE & SKIP
  const take = Number(perPage);
  const skip = (Number(page) - 1) * Number(perPage);

  // CACHE KEY
  const cacheKey = `mentors: ${JSON.stringify(filters)} ${skip} ${take}`;

  // Try to get cached mentors data
  const cachedMentors = await redis.get(cacheKey);

  // Declare mentors variable
  let mentors;

  // Check if cached mentors exist
  if (cachedMentors) {
    // Parse the cached data if it exists
    mentors = JSON.parse(cachedMentors);
  } else {
    // Fetch users from server if cache is empty
    mentors = await prisma.user.findMany({
      take,
      skip,
      where: {
        isMentor: true,
        ...filters,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Cache the fetched data with a TTL of 1800 seconds (30 minutes)
    await redis.set(cacheKey, JSON.stringify(mentors), "EX", 1800);
  }

  // Try to get cached mentors count
  const cachedMentorsCount = await redis.get("mentorsCount");

  // Declare mentorsCount variable
  let mentorsCount;

  // Check if cached mentors count exist
  if (cachedMentorsCount) {
    // Parse the cached data if it exists
    mentorsCount = JSON.parse(cachedMentorsCount);
  } else {
    // Fetch users count from server if cache is empty
    mentorsCount = await prisma.user.count({
      where: {
        isMentor: true,
        ...filters,
      },
    });

    // Cache the fetched data with a TTL of 1800 seconds (30 minutes)
    await redis.set("mentorsCount", JSON.stringify(mentorsCount), "EX", 1800);
  }

  // Pagination
  const totalPages = Math.ceil(mentors.length / Number(perPage));
  // Check if there are more mentors
  const hasNextPage = skip + take < mentorsCount;

  // JSX
  return (
    <div className="flex flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Our Mentors</h2>
        <Pagination
          page={page}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mentors.map((mentor: User) => (
          <MentorCard key={mentor.id} mentor={mentor} />
        ))}
      </div>
    </div>
  );
}

// MENTORS SECTION WITH SUSPENSE
export default function MentorsSectionWithSuspense(
  filterValues: FilterMentors,
) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center">
          <Loader2 size={32} className="animate-spin" />
        </div>
      }
    >
      <MentorsSection filterValues={filterValues} />
    </Suspense>
  );
}
