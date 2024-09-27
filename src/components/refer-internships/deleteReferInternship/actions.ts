"use server";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { getReferInternshipData } from "@/utils/types";

// DELETE REFER JOB
export async function deleteReferInternship(referInternshipId: string) {
  // Take user from session
  const { user } = await validateRequest();

  // If no user
  if (!user) throw new Error("Unauthorized.");

  // Find refer Job
  const referInternship = await prisma.referInternship.findUnique({
    where: { id: referInternshipId },
  });

  // If no refer job
  if (!referInternship) throw new Error("Refer internship not found.");

  // If user is not the owner
  if (referInternship.userId !== user.id) throw new Error("Unauthorized.");

  // Delete refer job
  const deletedReferInternship = await prisma.referInternship.delete({
    where: { id: referInternshipId },
    include: getReferInternshipData(user.id),
  });

  // Return refer job
  return deletedReferInternship;
}
