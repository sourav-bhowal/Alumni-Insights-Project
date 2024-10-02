"use server";
import { prisma } from "@/lib/prisma";
import streamServer from "@/lib/stream";
import {
  updateUserProfileSchema,
  UpdateUserProfileSchemaType,
} from "@/lib/validations";
import { validateRequest } from "@/lib/auth";
import { getUserData } from "@/utils/types";

// UPDATE USER PROFILE
export async function updateUserProfile(values: UpdateUserProfileSchemaType) {
  // validate values
  const validatedValues = updateUserProfileSchema.parse(values);

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
        location: validatedValues.location,
        bio: validatedValues.bio,
        yearOfGrad: validatedValues.yearOfGrad,
        skills: {
          set: validatedValues.skills.map((skillId) => ({ id: skillId })),
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
