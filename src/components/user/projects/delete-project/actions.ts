"use server";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { getUserProjectData } from "@/utils/types";
import { redis } from "@/lib/redis";
import { UTApi } from "uploadthing/server";

// DELETE REFER JOB
export async function deleteUserProject(userProjectId: string) {
  // Take user from session
  const { user } = await validateRequest();

  // If no user
  if (!user) throw new Error("Unauthorized.");

  // Find refer Job
  const userProject = await prisma.project.findUnique({
    where: { id: userProjectId },
  });

  // If no refer job
  if (!userProject) throw new Error("Refer job not found.");

  // If user is not the owner
  if (userProject.userId !== user.id) throw new Error("Unauthorized.");

  // Delete refer job
  const deletedUserProject = await prisma.project.delete({
    where: { id: userProjectId },
    include: getUserProjectData(user.id),
  });

  // Delete the media files of the post
  if (deletedUserProject) {
    // clear cache
    await redis.del(`userProjects:${user.id}`);
    // Delete media files from DB
    deletedUserProject.attachments.map(async (attachment) => {
      const deletedMedia = await prisma.attachment.delete({
        where: { id: attachment.id },
      });

      // Delete the media files from uploadthing
      if (deletedMedia) {
        // Delete media files from uploadthing
        const key = deletedMedia.url.split(
          `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
        )[1];
        await new UTApi().deleteFiles(key);
      }
    });
  }

  // Return refer job
  return deletedUserProject;
}
