"use client";
import { kyInstance } from "@/utils/ky";
import { UserData } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { HTTPError } from "ky";
import Link from "next/link";
import { PropsWithChildren } from "react";
import UserToolTip from "./UserToolTip";

// PROPS
interface UserLinkWithToolTipProps extends PropsWithChildren {
  username: string;
}

// USER LINK WITH TOOLTIP
export default function UserLinkWithToolTip({
  username,
  children,
}: UserLinkWithToolTipProps) {
  // React query to fetch user data
  const { data } = useQuery({
    queryKey: ["user-data", username],
    queryFn: () =>
      // get user data from api using ky instance
      kyInstance.get(`/api/users/username/${username}`).json<UserData>(),
    retry: (failureCount, error) => {
      if (error instanceof HTTPError && error.response.status === 404) {
        return false;
      } else {
        return failureCount < 3;
      }
    },
    staleTime: Infinity,
  });

  // if no data
  if (!data) {
    return (
      <Link
        href={`/users/${username}`}
        className="text-primary hover:underline"
      >
        {children}
      </Link>
    );
  }

  // return user link with tooltip
  return (
    <UserToolTip user={data}>
      <Link
        href={`/users/${username}`}
        className="text-primary hover:underline"
      >
        {children}
      </Link>
    </UserToolTip>
  );
}
