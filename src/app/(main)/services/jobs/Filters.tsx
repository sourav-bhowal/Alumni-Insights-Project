import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select from "@/components/ui/select";
import { filterReferJobSchema } from "@/lib/filterValidations";
import { prisma } from "@/lib/prisma";
import { referJobWorkTypes } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { redirect } from "next/navigation";

// FILTER JOBS FUNCTION
async function filterReferJobs(formData: FormData) {
  "use server";
  // GET FORM DATA VALUES AS OBJECT
  const values = Object.fromEntries(formData.entries());

  // VALIDATE FORM DATA
  const result = filterReferJobSchema.safeParse(values);

  // CHECK IF VALIDATION FAILED
  if (!result.success) {
    // Handle validation errors
    console.error(result.error.errors);
    return;
  }

  // DESTRUCTURE VALIDATED DATA
  const { q, workType, location, jobType, salary } = result.data;

  // SEARCH PARAMS
  const searchParams = new URLSearchParams({
    // FILTERS FOR SEARCH QUERY IF THEY ARE DEFINED
    ...(q && { q: q.trim() }), // TRIM WHITESPACES FROM SEARCH QUERY IF ANY
    ...(workType && { workType }),
    ...(location && { location }),
    ...(jobType && { jobType }),
    ...(salary && { salary }),
  });

  // REDIRECT TO REFER JOBS PAGE WITH SEARCH PARAMS
  redirect(`/services/jobs/?${searchParams.toString()}`);
}

// FILTER JOB COMPONENT
export default async function ReferJobsFilters() {
  // GET LOACTIONS FROM DB
  const distinctLocations = await prisma.referJob
    .findMany({
      select: { location: true },
      distinct: ["location"],
    })
    .then((locations) =>
      locations.map(({ location }) => location).filter(Boolean),
    );

  // JSX
  return (
    <aside className="h-fit rounded-2xl bg-card p-4 md:w-[300px]">
      <form action={filterReferJobs}>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="q" className="text-lg">
              Search
            </Label>
            <div className="relative">
              <Input
                name="q"
                id="q"
                placeholder="e.g. web developer, devops"
                className="h-12 rounded-2xl pl-10"
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 transform text-primary" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="workType" className="text-lg">
              Work Type
            </Label>
            <Select id="workType" name="workType" defaultValue={""}>
              <option value="">All types</option>
              {referJobWorkTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="location" className="text-lg">
              Location
            </Label>
            <Select id="location" name="location" defaultValue={""}>
              <option value="">All locations</option>
              {distinctLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col">
            <Label className="text-lg">Job Type</Label>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Input
                  type="checkbox"
                  name="jobType"
                  id="remote"
                  value="remote"
                  className="w-4 accent-primary"
                />
                <Label htmlFor="remote" className="text-md">
                  Remote
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="checkbox"
                  name="jobType"
                  id="onsite"
                  value="onsite"
                  className="w-4 accent-primary"
                />
                <Label htmlFor="onsite" className="text-md">
                  On-Site
                </Label>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="salary" className="text-lg">
              Salary Range
            </Label>
            <Select id="salary" name="salary" defaultValue="">
              <option value="">Select salary range</option>
              <option value="0-50000">0 - 50,000 per month</option>
              <option value="50000-100000">50,000 - 100,000 per month</option>
              <option value="100000-150000">100,000 - 150,000 per month</option>
              <option value="150000-200000">150,000 - 200,000 per month</option>
              <option value="200000+">200,000+</option>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            Apply Filters
          </Button>
        </div>
      </form>
    </aside>
  );
}
