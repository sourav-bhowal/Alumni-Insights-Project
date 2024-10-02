import ApplyFilterButton from "@/components/shared/ApplyFilterButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select from "@/components/ui/select";
import { filterMentorsSchema } from "@/lib/filterValidations";
import { prisma } from "@/lib/prisma";
import { SearchIcon } from "lucide-react";
import { redirect } from "next/navigation";

// FILTER JOBS FUNCTION
async function filterAlumni(formData: FormData) {
  "use server";
  // GET FORM DATA VALUES AS OBJECT
  const values = Object.fromEntries(formData.entries());

  // VALIDATE FORM DATA
  const result = filterMentorsSchema.safeParse(values);

  // CHECK IF VALIDATION FAILED
  if (!result.success) {
    // Handle validation errors
    console.error(result.error.errors);
    return;
  }

  // DESTRUCTURE VALIDATED DATA
  const { q, location, domain, fieldOfStudy } = result.data;

  // SEARCH PARAMS
  const searchParams = new URLSearchParams({
    // FILTERS FOR SEARCH QUERY IF THEY ARE DEFINED
    ...(q && { q: q.trim() }), // TRIM WHITESPACES FROM SEARCH QUERY IF ANY
    ...(location && { location }),
    ...(domain && { domain }),
    ...(fieldOfStudy && { fieldOfStudy }),
  });

  // REDIRECT TO REFER JOBS PAGE WITH SEARCH PARAMS
  redirect(`/alumni-community/alumni-directory/?${searchParams.toString()}`);
}

// FILTER JOB COMPONENT
export default async function MentorsFilters() {
  // GET LOACTIONS FROM DB
  const distinctLocations = await prisma.user
    .findMany({
      where: { isMentor: true },
      select: { location: true },
      distinct: ["location"],
    })
    .then((locations) =>
      locations.map(({ location }) => location).filter(Boolean),
    );

  // GET DOMAINS FROM DB
  const distinctDomains = await prisma.user
    .findMany({
      where: { isMentor: true },
      select: { domain: true },
      distinct: ["domain"],
    })
    .then((domains) => domains.map(({ domain }) => domain).filter(Boolean));

  // GET FIELD OF STUDY FROM DB
  const distinctFieldOfStudy = await prisma.user
    .findMany({
      where: { isMentor: true },
      select: { fieldOfStudy: true },
      distinct: ["fieldOfStudy"],
    })
    .then((fieldOfStudy) =>
      fieldOfStudy.map(({ fieldOfStudy }) => fieldOfStudy).filter(Boolean),
    );

  // JSX
  return (
    <aside className="h-fit rounded-2xl bg-card p-4 md:w-[300px]">
      <form action={filterAlumni}>
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
            <Label htmlFor="location" className="text-lg">
              Location
            </Label>
            <Select id="location" name="location" defaultValue={""}>
              <option value="">All locations</option>
              {distinctLocations.map((location) => (
                <option key={location} value={location!!}>
                  {location}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="doamin" className="text-lg">
              Domain
            </Label>
            <Select id="domain" name="domain" defaultValue={""}>
              <option value="">All Domains</option>
              {distinctDomains.map((domain) => (
                <option key={domain} value={domain!!}>
                  {domain}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="fieldOfStudy" className="text-lg">
              Field of Study
            </Label>
            <Select id="fieldOfStudy" name="fieldOfStudy" defaultValue={""}>
              <option value="">All Fields of Study</option>
              {distinctFieldOfStudy.map((field) => (
                <option key={field} value={field!!}>
                  {field}
                </option>
              ))}
            </Select>
          </div>
          <ApplyFilterButton className="w-full">
            Apply Filters
          </ApplyFilterButton>
        </div>
      </form>
    </aside>
  );
}
