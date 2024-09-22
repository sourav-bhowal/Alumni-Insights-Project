"use server";
import { prisma } from "@/lib/prisma";
import {
  createReferJobSchema,
  CreateReferJobSchemaType,
} from "@/lib/validations";
import { validateRequest } from "@/lib/auth";
import { getReferJobData } from "@/utils/types";

// CREATE JOB SERVER ACTION
export async function createReferJob(inputValues: CreateReferJobSchemaType) {
  // GET USER FROM SESSION
  const { user } = await validateRequest();

  // IF NO USER
  if (!user) throw Error("Unauthorized");

  // VALIDATE INPUT VALUES
  const { title, company, location, skills, category, salary, applyLink, jobType, workType } =
    createReferJobSchema.parse(inputValues);

  // CREATE JOB
  const newReferJob = await prisma.referJob.create({
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
      userId: user.id,
    },
    include: getReferJobData(user.id),
  });

  // RETURN JOB
  return newReferJob;
}
