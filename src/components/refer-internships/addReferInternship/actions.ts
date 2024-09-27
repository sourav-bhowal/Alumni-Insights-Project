"use server";
import { prisma } from "@/lib/prisma";
import {
  createReferInternshipSchema,
  CreateReferInternshipSchemaType,
} from "@/lib/validations";
import { validateRequest } from "@/lib/auth";
import { getReferInternshipData } from "@/utils/types";

// CREATE JOB SERVER ACTION
export async function createReferInternship(inputValues: CreateReferInternshipSchemaType) {
  // GET USER FROM SESSION
  const { user } = await validateRequest();

  // IF NO USER
  if (!user) throw Error("Unauthorized");

  // VALIDATE INPUT VALUES
  const { title, company, location, skills, duration, category, stipend, applyLink, workType } =
    createReferInternshipSchema.parse(inputValues);

  // CREATE JOB
  const newInternshipJob = await prisma.referInternship.create({
    data: {
      title,
      company,
      location,
      duration,
      skills: skills.split(","),
      category: category.split(","),
      stipend,
      applyLink,
      workType,
      userId: user.id,
    },
    include: getReferInternshipData(user.id),
  });

  // RETURN JOB
  return newInternshipJob;
}
