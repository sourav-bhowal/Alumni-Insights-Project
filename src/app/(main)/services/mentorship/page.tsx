import { FilterIcon, Loader2 } from "lucide-react";
import MentorsFilters from "./MentorFilters";
import MentorsSection from "./MentorsSection";
import { FilterMentors } from "@/lib/filterValidations";
import { Suspense } from "react";

// MENTOR PAGE PROPS
interface MentorPageProps {
  searchParams: {
    q?: string;
    location?: string;
    domain?: string;
    fieldOfStudy?: string;
    page?: string;
    perPage?: string;
  };
}

// This page will display all mentors
export default async function MentorPage({
  searchParams: { q, location, domain, fieldOfStudy, page, perPage },
}: MentorPageProps) {
  // Filter values
  const mentorFilterValues: FilterMentors = {
    q,
    location,
    domain,
    fieldOfStudy,
    page: page ?? "1",
    perPage: perPage ?? "1",
  };

  // JSX
  return (
    <main className="flex w-full flex-col gap-6 md:flex-row">
      {/* Left side div for filters */}
      <div className="p-4 md:sticky md:top-20 md:h-fit">
        <div className="mb-4 flex items-center justify-start gap-1 md:justify-center">
          <FilterIcon className="text-primary" />
          <h2 className="text-center text-lg font-semibold">Filters</h2>
        </div>
        <MentorsFilters />
      </div>

      {/* Right side div for displaying jobs */}
      <div className="w-full p-4">
        <h2 className="mb-4 text-lg font-semibold">Our Mentors</h2>
        {/* Add mentors display components here */}
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <MentorsSection filterValues={mentorFilterValues} />
        </Suspense>
      </div>
    </main>
  );
}
