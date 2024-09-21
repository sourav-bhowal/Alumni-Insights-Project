"use client";
import { useSession } from "@/context/SessionProvider";
import { UserData } from "@/utils/types";
import { PropsWithChildren } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Link from "next/link";
import UserAvatar from "./UserAvatar";
import LinkifyLinks from "./LinkifyLinks";

// TOOLTIP PROPS
interface UserToolTipProps extends PropsWithChildren {
  user: UserData;
}

// USER TOOLTIP
export default function UserToolTip({ user, children }: UserToolTipProps) {
  // get user from session
  const { user: loggedInUser } = useSession();

  // if not logged in
  if (!loggedInUser) throw new Error("Unauthorized.");

  // return tooltip
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <div className="flex max-w-80 flex-col gap-3 break-words px-1 py-2.5 md:min-w-52">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/users/${user.username}`}>
                <UserAvatar avatarUrl={user.avatarUrl} size={48} />
              </Link>
            </div>
            <div>
              <Link href={`/users/${user.username}`}>
                <h1 className="text-lg font-bold hover:underline">
                  {user.displayName}
                </h1>
                <h2 className="text-muted-foreground">@{user.username}</h2>
              </Link>
              {user.bio && (
                <LinkifyLinks>
                  <p className="line-clamp-4 whitespace-pre-line">{user.bio}</p>
                </LinkifyLinks>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
