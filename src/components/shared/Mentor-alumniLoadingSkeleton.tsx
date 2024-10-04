import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function AlumniSectionSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-10">
      <AlumniCardSkeleton />
      <AlumniCardSkeleton />
      <AlumniCardSkeleton />
      <AlumniCardSkeleton />
      <AlumniCardSkeleton />
      <AlumniCardSkeleton />
      <AlumniCardSkeleton />
      <AlumniCardSkeleton />
    </div>
  );
}

function AlumniCardSkeleton() {
  return (
    <Card className="w-64 bg-card text-white">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-28 w-28 rounded-full bg-zinc-800" />
          <div className="space-y-2 text-center">
            <Skeleton className="h-4 w-32 bg-zinc-800" />
            <Skeleton className="h-3 w-40 bg-zinc-800" />
          </div>
          <div className="w-full space-y-2">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4 rounded-full bg-zinc-800" />
              <Skeleton className="h-3 w-32 bg-zinc-800" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4 rounded-full bg-zinc-800" />
              <Skeleton className="h-3 w-40 bg-zinc-800" />
            </div>
          </div>
          <Skeleton className="h-10 w-full bg-primary" />
        </div>
      </CardContent>
    </Card>
  );
}
