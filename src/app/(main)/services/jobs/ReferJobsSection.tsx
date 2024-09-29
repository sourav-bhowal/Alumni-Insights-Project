"use client";
import { useEffect, useState } from "react";
import InfiniteScrollContainer from "@/components/shared/InfiniteScrollContainer";
import { kyInstance } from "@/utils/ky";
import { Loader2 } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
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
  // LOADING STATE
  const [isLoading, setIsLoading] = useState(false);

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
    queryKey: ["refer-jobs"],
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
  });

  // USE EFFECT TO FILTER JOBS BASED ON FILTER VALUES
  useEffect(() => {
    const filterJobs = async () => {
      setIsLoading(true);
      const response = await kyInstance.get("/api/refer-jobs/get-refer-jobs/", {
        searchParams: filterValues,
      });
      const filteredData = await response.json();
      setIsLoading(false);
      return filteredData;
    };

    // FILTER JOBS AND REFETCH
    filterJobs().then((filteredData) => {
      // Handle the filtered data if needed
      // console.log(filteredData);
      refetch();
    });
  }, [filterValues, refetch]);

  // FLAT MAP REFER JOBS
  const referJobs = data?.pages.flatMap((page) => page.referJobs) || [];

  // RENDERING POSTS
  if (status === "pending" || isLoading) {
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
