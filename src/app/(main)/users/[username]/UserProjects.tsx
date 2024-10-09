import ReferJobMoreButtons from "@/components/refer-jobs/ReferJobMoreButtons";
import UserProjectMoreButtons from "@/components/user/projects/UserprojectMoreButtons";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { cn } from "@/lib/utils";
import { getUserProjectData, UserData, UserProjectData } from "@/utils/types";
import { Attachment, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

// User Projects
export default async function UserProjects() {
  // Get user from session
  const { user: loggedInUser } = await validateRequest();

  // if user is not found
  if (!loggedInUser) throw new Error("Unauthorized");

  // Cache key
  const cacheKey = `userProjects:${loggedInUser.id}`;

  // Get user projects from cache
  const cachedProjects = await redis.get(cacheKey);

  // Declare projects variable
  let projects;

  // Check if cached projects exist
  if (cachedProjects) {
    // Parse the cached data if it exists
    projects = JSON.parse(cachedProjects);
  } else {
    // Fetch projects from server if cache is empty
    projects = await prisma.project.findMany({
      where: {
        userId: loggedInUser.id,
        showInProfile: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: getUserProjectData(loggedInUser.id),
    });
    // Cache the fetched data with a TTL of 1800 seconds (30 minutes)
    await redis.set(cacheKey, JSON.stringify(projects), "EX", 1800);
  }

  // RENDER
  return (
    <div>
      {projects.map((project: UserProjectData) => (
        <UserProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

// User Project Card Props
interface UserProjectCardProps {
  project: UserProjectData;
}

// User Project Card
async function UserProjectCard({ project }: UserProjectCardProps) {
  // Get user from session
  const { user: loggedInUser } = await validateRequest();

  return (
    <div className="group/project mt-3 flex flex-col rounded-lg bg-card p-4 shadow-md">
      <div className="flex justify-between">
        <h3 className="text-xl font-semibold capitalize">{project.title}</h3>
        {project.user.id === loggedInUser?.id && (
          <div className="transition-opacity group-hover/project:opacity-100 sm:opacity-0">
            {/* More buttons */}
            <UserProjectMoreButtons userProject={project} />
          </div>
        )}
      </div>
      <p className="text-sm font-semibold text-gray-500">
        {new Date(project.createdAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
      <p className="mt-2 text-sm text-gray-500">{project.description}</p>
      {
        // if project has media
        !!project.attachments && (
          <UserProjectMediaPreviews attachments={project.attachments} />
        )
      }
      {project.link && (
        <Link href={project.link} className="text-primary hover:underline items-end">
          View Details
        </Link>
      )}
    </div>
  );
}

//  MEDIA PREVIEWS COMPONENT PROPS
interface UserProjectMediaPreviewsProps {
  attachments: Attachment[];
}

//  MEDIA PREVIEWS COMPONENT
function UserProjectMediaPreviews({
  attachments,
}: UserProjectMediaPreviewsProps) {
  return (
    <div
      className={cn(
        "mt-4 flex flex-col gap-4",
        attachments.length > 1 && "sm:flex sm:flex-row",
      )}
    >
      {/* MEDIA PREVIEW FOR EACH MEDIA IN POST */}
      {attachments.map((attachment) => (
        <PostCardMediaPreview key={attachment.id} attachment={attachment} />
      ))}
    </div>
  );
}

// POST CARD MEDIA PREVIEW COMPONENT PROPS
interface MediaPreviewProps {
  attachment: Attachment;
}

// POST CARD MEDIA PREVIEW COMPONENT
function PostCardMediaPreview({ attachment }: MediaPreviewProps) {
  // if media is image
  if (attachment.type === "IMAGE") {
    console.log("ff", attachment.url);
    return (
      <Image
        src={attachment.url}
        alt={"media"}
        width={100}
        height={100}
        className="size-fit max-h-[30rem] rounded-xl"
      />
    );
  }

  // if media is video
  if (attachment.type === "VIDEO") {
    return (
      <div>
        <video
          src={attachment.url}
          controls
          className="size-fit max-h-[30rem] rounded-2xl"
        />
      </div>
    );
  }

  // if media is not supported
  return <p className="text-destructive">Unsupported Media</p>;
}
