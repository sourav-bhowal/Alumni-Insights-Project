"use client";
import { FilterMentors } from "@/lib/filterValidations";
import { kyInstance } from "@/utils/ky";
import { AlumniData } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { Pagination } from "../../../../components/shared/pagination";
import AlumniSectionSkeleton from "@/components/shared/Mentor-alumniLoadingSkeleton";
import { User } from "@prisma/client";
import MentorCard from "../../services/mentorship/MentorCard";
import AlumniCard from "./AlumniCard";

// ALUMNI SECTION
export default function AlumniSection({
  filterValues,
  page,
}: {
  filterValues: FilterMentors;
  page: string | undefined;
}) {
  // USE QUERY TO FETCH ALUMNI
  const { data, isFetching, isError } = useQuery({
    queryKey: ["alumni", filterValues],
    queryFn: async () => {
      // FETCH ALUMNI DATA
      return await kyInstance
        .get("/api/alumni/get-alumni", { searchParams: filterValues })
        .json<AlumniData>();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // TAKE OUT ALL THE DATA
  const alumni = data?.alumni;
  const hasNextPage = data?.hasNextPage;
  const totalPages = data?.totalPages;

  // JSX
  if (isFetching) {
    return <AlumniSectionSkeleton />;
  }

  if (isError || !alumni?.length) {
    return (
      <div className="flex w-full items-center justify-center">
        <div className="text-red-500">Failed to fetch alumni</div>
      </div>
    );
  }

  // JSX
  return (
    <div className="flex flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Our Alumni</h2>
        <Pagination
          page={page}
          totalPages={totalPages || 0}
          hasNextPage={hasNextPage || false}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {alumni.map((alumnus: User) => (
          <AlumniCard key={alumnus.id} alumni={alumnus} />
        ))}
      </div>
    </div>
  );
}
