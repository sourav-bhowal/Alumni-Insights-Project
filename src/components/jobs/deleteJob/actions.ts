"use server";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { getReferJobData } from "@/utils/types";

// DELETE REFER JOB
export async function deleteReferJob(id: string) {
  // Take user from session
  const { user } = await validateRequest();

  // If no user
  if (!user) throw new Error("Unauthorized.");

  // Find refer Job
  const referJob = await prisma.referJob.findUnique({
    where: { id },
  });

  // If no refer job
  if (!referJob) throw new Error("Refer job not found.");

  // If user is not the owner
  if (referJob.userId !== user.id) throw new Error("Unauthorized.");

  // Delete refer job
  const deletedReferJob = await prisma.referJob.delete({
    where: { id },
    include: getReferJobData(user.id),
  });

  // Return refer job
  return deletedReferJob;
}
