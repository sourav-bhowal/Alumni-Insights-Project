import MentorCard from "./MentorCard";
import { prisma } from "@/lib/prisma";
import { FilterMentors } from "@/lib/filterValidations";
import { Pagination } from "./pagination";

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

  // Fetch users from server
  const mentors = await prisma.user.findMany({
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

  // Count mentors
  const mentorsCount = await prisma.user.count({
    where: {
      isMentor: true,
      ...filters,
    },
  });

  // Pagination
  const totalPages = Math.ceil(mentors.length / Number(perPage));
  // Check if there are more mentors
  const hasNextPage = skip + take < mentorsCount;

  // JSX
  return (
    <div className="flex flex-col md:gap-52 gap-10">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mentors.map((mentor) => (
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
