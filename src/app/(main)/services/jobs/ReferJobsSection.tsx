"use client";
import { useEffect } from "react";
import InfiniteScrollContainer from "@/components/shared/InfiniteScrollContainer";
import { kyInstance } from "@/utils/ky";
import { Loader2 } from "lucide-react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { ReferJobPage } from "@/utils/types";
import ReferJobCard from "./ReferJobCard";
import { FilterReferJob } from "@/lib/filterValidations";
import JobInternshipLoadingSkel from "@/components/shared/Job-InternshipLoadingSkeleton";

// REFER JOBS SECTION
export default function ReferJobsSection({
  filterValues,
}: {
  filterValues: FilterReferJob;
}) {
  // USE INFINITE QUERY
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["refer-jobs", filterValues],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/refer-jobs/get-refer-jobs/",
          pageParam
            ? { searchParams: { cursor: pageParam, ...filterValues } }
            : { searchParams: filterValues },
        )
        .json<ReferJobPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // USE EFFECT TO REFETCH DATA ON FILTER CHANGE
  useEffect(() => {
    refetch();
  }, [filterValues, refetch]);

  // FLAT MAP REFER JOBS
  const referJobs = data?.pages.flatMap((page) => page.referJobs) || [];

  // RENDERING POSTS
  if (status === "pending") {
    return (
      <div className="flex w-full items-center justify-center">
        <JobInternshipLoadingSkel />
      </div>
    );
  }

  if (status === "success" && !referJobs.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        No one has referred any job yet.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading referred jobs.
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {referJobs.map((referJob) => (
        <ReferJobCard key={referJob.id} referJob={referJob} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}
