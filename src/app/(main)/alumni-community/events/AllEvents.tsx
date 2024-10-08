"use client";
import InfiniteScrollContainer from "@/components/shared/InfiniteScrollContainer";
import { kyInstance } from "@/utils/ky";
import { EventPage } from "@/utils/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import EventCard from "./EventCard";
import EventCardSkeleton from "@/components/events/EventCardLoadingSkeleton";

// ALL EVENTS PAGE
export default function AllEvents() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["all-events"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/events/get-all-events",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<EventPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // EVENTS
  const events = data?.pages.flatMap((page) => page.events) || [];

  // RENDERING EVENTS
  if (status === "pending") {
    return <EventCardSkeleton />;
  }

  // IF THERE ARE NO EVENTS
  if (status === "success" && !events.length && !hasNextPage) {
    return <p className="text-center text-muted-foreground">No events yet.</p>;
  }

  // IF THERE IS AN ERROR
  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occured while loading events.
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
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  ); 
}
