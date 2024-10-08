"use server";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import {
  CreateUserProjectSchemaType,
  createUserProjectSchema,
} from "@/lib/validations";
import { getUserProjectData } from "@/utils/types";
import { UTApi } from "uploadthing/server";
import { redis } from "@/lib/redis";

// CREATE USER PROJECT SERVER ACTION
export async function createUserProject(
  inputValues: CreateUserProjectSchemaType,
) {
  // GET USER FROM SESSION
  const { user } = await validateRequest();

  // IF NO USER
  if (!user) throw Error("Unauthorized");

  // VALIDATE INPUT VALUES
  const { title, description, link, showInProfile, mediaIds } =
    createUserProjectSchema.parse(inputValues);

  // CREATE USER PROJECT
  const newUserProject = await prisma.project.create({
    data: {
      title,
      description,
      link,
      showInProfile,
      attachments: {
        connect: mediaIds.map((mediaId) => ({ id: mediaId })),
      },
      userId: user.id,
    },
    include: getUserProjectData(user.id),
  });

  // IF NO EVENT
  if (!newUserProject) {
    mediaIds.map(async (mediaId) => {
      const deletedMedia = await prisma.attachment.delete({
        where: { id: mediaId },
      });

      // DELETE MEDIA FROM UPLOADTHING
      if (deletedMedia) {
        const key = deletedMedia.url.split(
          `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
        )[1];
        await new UTApi().deleteFiles(key);
      }
    });
  } else {
    await redis.del(`userProjects:${user.id}`);
  }

  // RETURN NEW USER PROJECT
  return newUserProject;
}
