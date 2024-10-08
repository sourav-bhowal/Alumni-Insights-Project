"use client";
import InfiniteScrollContainer from "@/components/shared/InfiniteScrollContainer";
import { kyInstance } from "@/utils/ky";
import { EventPage } from "@/utils/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import EventCard from "./EventCard";
import EventCardSkeleton from "@/components/events/EventCardLoadingSkeleton";

// ALL EVENTS PAGE
export default function Webinars() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["all-events", "webinars"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/events/get-webinars",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<EventPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // EVENTS
  const webinars = data?.pages.flatMap((page) => page.events) || [];

  // RENDERING EVENTS
  if (status === "pending") {
    return <EventCardSkeleton />;
  }

  // IF THERE ARE NO EVENTS
  if (status === "success" && !webinars.length && !hasNextPage) {
    return <p className="text-center text-muted-foreground">No Reunion events yet.</p>;
  }

  // IF THERE IS AN ERROR
  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occured while loading reunion events.
      </p>
    );
  }

  // RENDER EVENTS
  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {webinars.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}
