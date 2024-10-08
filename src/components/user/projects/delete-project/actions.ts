"use server";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { getUserProjectData } from "@/utils/types";
import { redis } from "@/lib/redis";

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

  if (deletedUserProject) {
    // Delete cache
    await redis.del(`userProjects:${user.id}`);
  }

  // Return refer job
  return deletedUserProject;
}
