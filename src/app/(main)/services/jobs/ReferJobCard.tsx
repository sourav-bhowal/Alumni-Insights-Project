import UserToolTip from "@/components/shared/UserToolTip";
import { useSession } from "@/context/SessionProvider";
import UserAvatar from "@/components/shared/UserAvatar";
import Link from "next/link";
import { ReferJobData } from "@/utils/types";
import { formatRelativeDate, isWithinOneHour } from "@/utils/time";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MapPinIcon,
  ClockIcon,
  BanknoteIcon,
  ArrowUpRightIcon,
  Clock10Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ReferJobMoreButtons from "@/components/jobs/ReferJobMoreButtons";
// INTERFACE OF REFER JOB CARD
interface ReferJobCardProps {
  referJob: ReferJobData;
}

// REFER JOB CARD
export default function ReferJobCard({ referJob }: ReferJobCardProps) {
  // USER FROM SESSION
  const { user: loggedInUser } = useSession();
  // Check if createdAt is within 1 hour
  const isNew = isWithinOneHour(referJob.createdAt);

  // JSX
  return (
    <Card className="group/referJob w-full bg-card text-zinc-100">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-5">
          <div className="flex w-full flex-col justify-between sm:flex-row sm:items-center sm:gap-5">
            <div className="flex sm:gap-5">
              <CardTitle className="text-lg font-bold capitalize sm:text-2xl">
                {referJob.title}
              </CardTitle>
              <Button
                className={`hidden h-8 items-center gap-2 rounded-full bg-gray-500/35 pr-3 text-center text-sm font-medium capitalize text-gray-500 hover:bg-gray-500/50 md:flex ${
                  isNew &&
                  "bg-green-500/30 text-green-500 hover:bg-green-500/50"
                }`}
              >
                <ClockIcon className="h-5 w-5" />
                {formatRelativeDate(referJob.createdAt)}
              </Button>
            </div>
            {referJob.user.id === loggedInUser?.id ? (
              <ReferJobMoreButtons
                referJob={referJob}
                className="transition-opacity group-hover/referJob:opacity-100 sm:opacity-0"
              />
            ) : (
              <>
                <div className="hidden items-center gap-2 text-muted-foreground md:flex">
                  <h2>Refered by</h2>
                  <UserToolTip user={referJob.user}>
                    <Link href={`/users/${referJob.user.username}`}>
                      <UserAvatar avatarUrl={referJob.user.avatarUrl} />
                    </Link>
                  </UserToolTip>
                </div>
              </>
            )}
          </div>
        </div>
        <p className="text-xs capitalize text-zinc-400 sm:text-sm">
          {referJob.company}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col text-xs sm:flex-row sm:items-center sm:space-x-2 sm:text-sm">
          <div className="flex items-center space-x-2">
            <MapPinIcon className="h-4 w-4 text-primary" />
            <span className="capitalize">{referJob.location}</span>
          </div>
          <div className="mt-2 flex items-center space-x-2 sm:mt-0">
            <ClockIcon className="h-4 w-4 text-primary" />
            <span className="capitalize">{referJob.workType}</span>
          </div>
          <div className="mt-2 flex items-center space-x-2 sm:mt-0">
            <BanknoteIcon className="h-4 w-4 text-primary" />
            <span>₹ {referJob.salary} / month</span>
          </div>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold tracking-wide">
            CATEGORIES
          </h3>
          <div className="flex flex-wrap gap-2">
            {referJob.category.map((category) => (
              <Button
                key={category}
                className="h-8 min-w-20 rounded-sm bg-primary/35 text-center font-normal capitalize text-primary hover:bg-primary/50"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold tracking-wide">SKILLS</h3>
          <div className="flex flex-wrap gap-2 md:w-[80%]">
            {referJob.skills.map((skill) => (
              <Button
                key={skill}
                className="h-8 w-24 rounded-sm bg-primary/35 text-center font-normal capitalize text-primary hover:bg-primary/50"
              >
                {skill}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3">
        <Link href={referJob.applyLink}>
          <Button className="text-md mt-4 w-full border-2 border-primary bg-background text-center font-bold tracking-wide text-white hover:bg-primary sm:w-fit">
            Apply Now
            <ArrowUpRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Button
          className={`flex h-8 items-center gap-2 bg-gray-500/35 pr-3 text-center text-sm font-medium capitalize text-gray-500 hover:bg-gray-500/50 md:hidden ${
            isNew && "bg-green-500/30 text-green-500 hover:bg-green-500/50"
          }`}
        >
          <ClockIcon className="h-5 w-5" />
          {formatRelativeDate(referJob.createdAt)}
        </Button>
      </CardFooter>
    </Card>
  );
}
