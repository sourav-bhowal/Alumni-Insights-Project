import MentorCard from "./MentorCard";
import { prisma } from "@/lib/prisma";
import { FilterMentors } from "@/lib/filterValidations";
import { Pagination } from "./pagination";
import { redis } from "@/lib/redis";
import { User } from "@prisma/client";

// INTERFACE FOR MENTOR LIST
interface MentorsSectionProps {
  filterValues: FilterMentors;
}

// MENTORS SECTION
export default async function MentorsSection({
  filterValues: { q, location, domain, fieldOfStudy, page, perPage },
}: MentorsSectionProps) {
  // search string
  const searchString = q
    ?.split(" ")
    .filter((word) => word.length > 0)
    .join(" & ");

  // FILTERS
  const filters: any = {
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

  // Take
  const take = Number(perPage);
  // Skip
  const skip = (Number(page) - 1) * Number(perPage);

  // Try to get cached mentors data
  const cachedMentors = await redis.get(`mentors:${filters}${take}${skip}`);

  // Declare mentors variable
  let mentors;

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
    await redis.set(
      `mentors:${filters}${take}${skip}`,
      JSON.stringify(mentors),
      "EX",
      300,
    );
  }

  // Try to get cached mentors count
  const cachedMentorsCount = await redis.get("mentorsCount");

  // Declare mentorsCount variable
  let mentorsCount;

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
    <div className="flex flex-col gap-10 md:gap-52">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mentors.map((mentor: User) => (
          <MentorCard key={mentor.id} mentor={mentor} />
        ))}
      </div>
      <div>
        <Pagination
          page={page}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
        />
      </div>
    </div>
  );
}
