import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// EVENT CARD LOADING SKELETON
export default function EventCardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <EventCardLoadingSkeleton />
      <EventCardLoadingSkeleton />
      <EventCardLoadingSkeleton />
      <EventCardLoadingSkeleton />
      <EventCardLoadingSkeleton />
      <EventCardLoadingSkeleton />
    </div>
  );
}

// SINGLE EVENT CARD SKELETON
function EventCardLoadingSkeleton() {
  return (
    <Card className="overflow-hidden bg-card">
      <div className="flex h-[250px]">
        <div className="relative w-1/3">
          <Skeleton className="h-full w-full bg-background" />
        </div>
        <CardContent className="relative flex w-2/3 flex-col justify-between p-6">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="w-3/4 space-y-2">
                <Skeleton className="h-6 w-3/4 bg-background" />
                <Skeleton className="h-4 w-1/2 bg-background" />
              </div>
              <Skeleton className="absolute right-0 top-4 hidden h-8 w-24 rounded-l-[8px] rounded-r-none bg-background md:flex" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/2 bg-background" />
              <Skeleton className="h-4 w-1/3 bg-background" />
              <Skeleton className="h-4 w-1/4 bg-background" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-20 rounded-full bg-background" />
            <Skeleton className="h-10 w-24 rounded bg-background" />
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
