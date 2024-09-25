import ErrorPage from "@/app/error";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserData, UserData } from "@/utils/types";
import { Metadata } from "next";
import { cache } from "react";

// User Page Props
interface UserPageProps {
  params: {
    username: string;
  };
}

// Fetch User Data from cache
const fetchUser = cache(async (username: string, loggedInUserId: string) => {
  // get user
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserData(loggedInUserId),
  });

  // if user not found
  if (!user) ErrorPage();
  // return user
  return user;
});

// Generate Meta Data for User Page
export async function generateMetadata({
  params,
}: UserPageProps): Promise<Metadata> {
  // get logged in user
  const { user: loggedInUser } = await validateRequest();
  // if not logged in
  if (!loggedInUser) return {};
  // get user
  const user = await fetchUser(params.username, loggedInUser.id);
  // if user
  return {
    title: `@${user?.username}`,
  };
}

// User profile props
interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

// User Profile Component
async function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  return (
    <></>
  )
}