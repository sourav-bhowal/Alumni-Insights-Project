"use server";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { getReferInternshipData } from "@/utils/types";
import { createReferInternshipSchema } from "@/lib/validations";

// TYPE OF EDIT REFER JOB DATA
export interface EditReferInternshipData {
  referInternshipId: string;
  editedReferInternshipData: {
    title: string;
    company: string;
    location: string;
    stipend: number;
    skills: string;
    category: string;
    applyLink: string;
    workType: string;
    duration: number;
  };
}

// EDIT REFER JOB SERVER ACTION
export async function editReferInternship({
  referInternshipId,
  editedReferInternshipData,
}: EditReferInternshipData) {
  // GET USER FROM SESSION
  const { user } = await validateRequest();

  // IF NO USER
  if (!user) throw Error("Unauthorized");

  // Find refer Job
  const referInternship = await prisma.referInternship.findUnique({
    where: { id: referInternshipId },
  });

  // If no refer job
  if (!referInternship) throw new Error("Refer job not found.");

  // If user is not the owner
  if (referInternship.userId !== user.id) throw new Error("Unauthorized.");

  // VALIDATE INPUT VALUES
  const {
    title,
    company,
    location,
    skills,
    category,
    stipend,
    applyLink,
    duration,
    workType,
  } = createReferInternshipSchema.parse(editedReferInternshipData);

  // EDIT JOB
  const editedReferInternship = await prisma.referInternship.update({
    where: { id: referInternshipId },
    data: {
      title,
      company,
      location,
      skills: skills.split(","),
      category: category.split(","),
      stipend,
      applyLink,
      duration,
      workType,
    },
    include: getReferInternshipData(user.id),
  });

  // RETURN JOB
  return editedReferInternship;
}
