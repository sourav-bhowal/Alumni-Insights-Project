import { formatDate, formatDistanceToNowStrict } from "date-fns";

// TIME FUNCTION
export function formatRelativeDate(fromDate: Date) {
  // current date
  const currentDate = new Date();
  // condition if date is within 24hrs
  if (currentDate.getTime() - fromDate.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(fromDate, { addSuffix: true });
  }
  // if date is older then 24 hrs
  else {
    // if date is within 1 year
    if (currentDate.getFullYear() === fromDate.getFullYear()) {
      return formatDate(fromDate, "MMM d");
      // if date is older then 1 year
    } else {
      return formatDate(fromDate, "MMM d, yyyy");
    }
  }
}

// utils/date.ts
import { differenceInMinutes } from "date-fns";

export function isWithinOneHour(date: Date): boolean {
  return differenceInMinutes(new Date(), new Date(date)) <= 60;
}
