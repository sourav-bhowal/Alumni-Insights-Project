import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function JobInternshipLoadingSkel() {
  return (
    <div className="w-full space-y-5">
      <JobInternshipLoadingSkeleton />
      <JobInternshipLoadingSkeleton />
      <JobInternshipLoadingSkeleton />
    </div>
  );
}

// SINGLE SKELETON
function JobInternshipLoadingSkeleton() {
  return (
    <Card className="w-full bg-card text-white">
      <CardContent className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40 bg-zinc-800" />
            <Skeleton className="h-4 w-24 bg-zinc-800" />
          </div>
          <Skeleton className="size-14 bg-zinc-800 rounded-full" />
        </div>
        <div className="mb-4 space-y-2">
          <Skeleton className="h-4 w-3/4 bg-zinc-800" />
        </div>
        <div className="mb-4 space-y-2">
          <Skeleton className="h-4 w-32 bg-zinc-800" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-24 rounded-full bg-zinc-800" />
            <Skeleton className="h-8 w-24 rounded-full bg-zinc-800" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 bg-zinc-800" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-24 rounded-full bg-zinc-800" />
            <Skeleton className="h-8 w-24 rounded-full bg-zinc-800" />
            <Skeleton className="h-8 w-24 rounded-full bg-zinc-800" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Skeleton className="h-10 w-36 bg-zinc-800" />
      </CardFooter>
    </Card>
  );
}
