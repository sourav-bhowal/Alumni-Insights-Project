import { FilterIcon } from "lucide-react";
import AlumniFilters from "./AlumniFilters";
import { FilterMentors } from "@/lib/filterValidations";
import { Metadata } from "next";
import AlumniSection from "./AlumniSection";

// METADATA
export const metadata: Metadata = {
  title: "Alumni Directory",
  description: "Find and connect with our alumni community",
};

// MENTOR PAGE PROPS
interface AlumniPageProps {
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
}: AlumniPageProps) {
  // Filter values
  const alumniFilterValues: FilterMentors = {
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
        <AlumniFilters />
      </div>

      {/* Right side div for displaying jobs */}
      <div className="w-full p-4">
        {/* Add mentors display components here */}
        <AlumniSection filterValues={alumniFilterValues} page={page} />
      </div>
    </main>
  );
}
