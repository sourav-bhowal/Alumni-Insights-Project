"use server";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { getReferJobData } from "@/utils/types";
import { createReferJobSchema } from "@/lib/validations";

// TYPE OF EDIT REFER JOB DATA
export interface EditReferJobData {
  referJobId: string;
  editedReferJobData: {
    title: string;
    company: string;
    location: string;
    salary: string;
    skills: string;
    category: string;
    applyLink: string;
    jobType: string;
    workType: string;
  };
}

// EDIT REFER JOB SERVER ACTION
export async function editReferJob({
  referJobId,
  editedReferJobData,
}: EditReferJobData) {
  // GET USER FROM SESSION
  const { user } = await validateRequest();

  // IF NO USER
  if (!user) throw Error("Unauthorized");

  // Find refer Job
  const referJob = await prisma.referJob.findUnique({
    where: { id: referJobId },
  });

  // If no refer job
  if (!referJob) throw new Error("Refer job not found.");

  // If user is not the owner
  if (referJob.userId !== user.id) throw new Error("Unauthorized.");

  // VALIDATE INPUT VALUES
  const {
    title,
    company,
    location,
    skills,
    category,
    salary,
    applyLink,
    jobType,
    workType,
  } = createReferJobSchema.parse(editedReferJobData);

  // EDIT JOB
  const editedReferJob = await prisma.referJob.update({
    where: { id: referJobId },
    data: {
      title,
      company,
      location,
      skills: skills.split(","),
      category: category.split(","),
      salary,
      applyLink,
      jobType,
      workType,
    },
    include: getReferJobData(user.id),
  });

  // RETURN JOB
  return editedReferJob;
}
