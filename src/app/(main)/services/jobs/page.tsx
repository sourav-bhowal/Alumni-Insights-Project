import ReferJobsSection from "./ReferJobsSection";
import ReferJobsFilters from "./Filters";
import { FilterIcon } from "lucide-react";
import AddReferJobButton from "./AddReferJobButton";
import { FilterReferJob } from "@/lib/filterValidations";
import { Metadata } from "next";

// METADATA
export const metadata: Metadata = {
  title: "Find Jobs",
  description: "Find jobs refered by your alumni",
};

// INTERFACE
interface ReferJobsPageProps {
  searchParams: {
    q?: string;
    workType?: string;
    location?: string;
    jobType?: string;
    salary?: string;
  };
}

export default function ReferJobsPage({
  searchParams: { q, workType, location, jobType, salary },
}: ReferJobsPageProps) {
  // FILTER VALUES
  const referJobFilterValues: FilterReferJob = {
    q,
    workType,
    location,
    jobType,
    salary,
  };

  // JSX
  return (
    <div className="flex w-full flex-col gap-6 md:flex-row">
    {/* Left side div for filters */}
    <div className="md:sticky md:top-20 md:h-fit p-4">
      <div className="mb-4 flex items-center justify-start gap-1 md:justify-center">
        <FilterIcon className="text-primary" />
        <h2 className="text-center text-lg font-semibold">Filters</h2>
      </div>
      <ReferJobsFilters />
    </div>

    {/* Right side div for displaying jobs */}
    <div className="grow p-4 max-w-6xl">
      <h2 className="mb-4 text-lg font-semibold">Refered Jobs</h2>
      {/* Add job display components here */}
      <ReferJobsSection filterValues={referJobFilterValues} />
    </div>
    {/* <AddReferJobButton /> */}
  </div>
  );
}
