"use server";
import { prisma } from "@/lib/prisma";
import streamServer from "@/lib/stream";
import { validateRequest } from "@/lib/auth";
import { getUserData } from "@/utils/types";
import { updateUserSchema, UpdateUserSchemaType } from "@/lib/validations";

// UPDATE USER PROFILE
export async function updateUserProfile(values: UpdateUserSchemaType) {
  // validate values
  const validatedValues = updateUserSchema.parse(values);

  // user from session
  const { user } = await validateRequest();

  // if no user
  if (!user) throw new Error("Unauthorized.");

  // Prisma transaction
  const updatedUser = await prisma.$transaction(async (tx) => {
    // update user
    const updatedUser = await tx.user.update({
      where: {
        id: user.id,
      },
      data: {
        username: validatedValues.username,
        displayName: validatedValues.displayName,
        bio: validatedValues.bio,
        location: validatedValues.location,
        yearOfGrad: validatedValues.yearOfGrad,
        skills: {
          connect: validatedValues.skills.map((skill) => ({
            id: skill.id,
          })),
        },
      },
      select: getUserData(user.id),
    });

    // stream user
    await streamServer.partialUpdateUser({
      id: user.id,
      set: {
        name: validatedValues.username,
      },
    });

    // return updated user data to client
    return updatedUser;
  });

  // return updated user data to client
  return updatedUser;
}
