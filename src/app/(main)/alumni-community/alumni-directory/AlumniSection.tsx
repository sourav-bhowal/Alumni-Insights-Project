"use client";
import { FilterMentors } from "@/lib/filterValidations";
import { kyInstance } from "@/utils/ky";
import { AlumniData } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { Pagination } from "../../services/mentorship/pagination";

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
    return <div>Loading...</div>;
  }

  if (isError || !alumni?.length) {
    return (
      <div className="flex w-full items-center justify-center">
        <div>Failed to fetch alumni</div>
      </div>
    );
  }

  return <>
  {alumni.map((alumnus) => (
    <div key={alumnus.id}>
      <h1>{alumnus.displayName}</h1>
      <p>{alumnus.bio}</p>
    </div>
  ))}
  <Pagination totalPages={totalPages || 0} hasNextPage={hasNextPage || false} page={page}/>
  </>;
}
