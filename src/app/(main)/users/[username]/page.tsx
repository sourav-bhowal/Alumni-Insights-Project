"use server";
import ErrorPage from "@/app/error";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserData, UserData } from "@/utils/types";
import { Skill } from "@prisma/client";
import { Metadata } from "next";
import { cache, use } from "react";
import EditProfileButton from "./EditProfileButton";
import { formatNumber } from "@/utils/topicsCount";
import { formatDate } from "date-fns";
import UserAvatar from "@/components/shared/UserAvatar";
import LinkifyLinks from "@/components/shared/LinkifyLinks";
import UserDetails from "./UserDetails";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import UserBadge from "./Badge";
import AddUserProjectDialog from "@/components/user/projects/add-project/AddUserProjectForm";
import AddEventButton from "../../alumni-community/events/AddEventButton";
import AddUserProjectButton from "@/components/user/projects/add-project/AddUserProjectButton";

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

// Fetch skills from db
export const fetchSkills = cache(async (): Promise<Skill[]> => {
  // get skills
  const skills = await prisma.skill.findMany();
  // return skills
  return skills;
});

// Fetch User Projects shown on profile
const UserProfileShownProjects = cache(async (userId: string) => {
  const showInProfileProjects = await prisma.project.count({
    where: {
      userId,
      showInProfile: true,
    },
  });
  return showInProfileProjects;
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
  const UserProfileShownProjectsCount = await UserProfileShownProjects(user.id);
  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <UserAvatar
        avatarUrl={user.avatarUrl}
        size={250}
        className="mx-auto size-full max-h-60 max-w-60 rounded-full"
      />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <div className="flex gap-5">
              <h1 className="text-3xl font-bold">{user.displayName}</h1>
              <UserBadge user={user} className="hidden xl:flex" />
            </div>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
          <UserBadge user={user} className="flex xl:hidden" />
          <p>Member since {formatDate(user.createdAt, "MMMM d, yyyy")}</p>
          <div className="flex items-center gap-3">
            <span>
              Projects:{" "}
              <span className="font-semibold">
                {formatNumber(user._count.projects)}
              </span>
            </span>
            <span>
              Research Papers:{" "}
              <span className="font-semibold">
                {formatNumber(user._count.researchPapers)}
              </span>
            </span>
            {/* <UserFollowerCount userId={user.id} initialState={followerInfo} /> */}
          </div>
        </div>
        {/* Edit Profile if logged in user is same as user profile otherwise follow/unfollow */}
        {user.id === loggedInUserId && (
          <div className="space-y-3">
            <EditProfileButton user={user} />
            <AddUserProjectButton userProfileProjectCount={UserProfileShownProjectsCount}/>
          </div>
          // ) : (
          // <FollowButton userId={user.id} initialState={followerInfo} />
        )}
      </div>
      {user.skills.length > 0 && (
        <>
          <hr />
          <h2 className="font-semibold uppercase tracking-wide">Skills</h2>
          <div className="flex flex-wrap gap-2 overflow-hidden whitespace-pre-line">
            {user.skills.map((skill) => (
              <div
                key={skill.id}
                className="rounded-2xl bg-primary/20 p-2 pl-4 pr-4 text-primary"
              >
                {skill.name}
              </div>
            ))}
          </div>
        </>
      )}
      {user.bio && (
        <>
          <hr />
          <h2 className="font-semibold uppercase tracking-wide">Bio</h2>
          <LinkifyLinks>
            <p className="overflow-hidden whitespace-pre-line break-words">
              {user.bio}
            </p>
          </LinkifyLinks>
        </>
      )}
    </div>
  );
}

// User Page Component
export default async function UserPage({ params }: UserPageProps) {
  // get logged in user
  const { user: loggedInUser } = await validateRequest();

  // if not logged in
  if (!loggedInUser)
    return <p className="text-destructive">You need to be logged in</p>;

  // get user
  const user = await fetchUser(params.username, loggedInUser.id);

  return (
    <main className="flex w-full min-w-0 flex-col gap-5 md:flex-row">
      <div className="w-full min-w-0 space-y-5 md:w-[60%]">
        {/* User Profile Component of User */}
        <UserProfile user={user!!} loggedInUserId={loggedInUser.id} />
        {/* <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            {user?.username}&apos;s posts
          </h2>
        </div> */}
        {/* Posts Feed Component of User */}
        {/* <UserPostsFeed userId={user.id} /> */}
      </div>
      {/* User Details Bar */}
      <div className="w-full space-y-3 md:w-[40%]">
        {user?.id === loggedInUser.id ? (
          <div className="flex gap-1">
            <p className="w-[90%] rounded-l-2xl bg-card p-4 text-center text-3xl font-semibold uppercase tracking-wider">
              Showcase
            </p>
            <button className="w-[10%] rounded-r-2xl bg-card">
              <Plus size={30} className="w-full font-bold" />
            </button>
          </div>
        ) : (
          <>
            <p className="w-full rounded-2xl bg-card p-4 text-center text-3xl font-semibold uppercase tracking-wider">
              Showcase
            </p>
          </>
        )}
        <UserDetails />
      </div>
    </main>
  );
}
