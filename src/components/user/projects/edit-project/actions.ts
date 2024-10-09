"use server";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { getUserProjectData } from "@/utils/types";
import {
  createUserProjectSchema,
  CreateUserProjectSchemaType,
} from "@/lib/validations";
import { UTApi } from "uploadthing/server";
import { redis } from "@/lib/redis";

// TYPE OF EDIT REFER JOB DATA
interface EditUserProjectData {
  userProjectId: string;
  editedUserProjectData: CreateUserProjectSchemaType;
}

// EDIT REFER JOB SERVER ACTION
export async function editUserProject({
  userProjectId,
  editedUserProjectData,
}: EditUserProjectData) {
  // GET USER FROM SESSION
  const { user } = await validateRequest();

  // IF NO USER
  if (!user) throw Error("Unauthorized");

  // Find refer Job
  const userProject = await prisma.project.findUnique({
    where: { id: userProjectId },
    include: { attachments: true },
  });

  // If no refer job
  if (!userProject) throw new Error("project not found.");

  // If user is not the owner
  if (userProject.userId !== user.id) throw new Error("Unauthorized.");

  // VALIDATE INPUT VALUES
  const { title, description, link, showInProfile, mediaIds } =
    createUserProjectSchema.parse(editedUserProjectData);

  // EDIT JOB
  const editedUserProject = await prisma.project.update({
    where: { id: userProjectId },
    data: {
      title,
      description,
      link,
      showInProfile,
      attachments: {
        // disconnect old attachments
        disconnect: userProject.attachments.map((attachment) => ({
          id: attachment.id,
        })),
        // connect new attachments
        connect: mediaIds.map((mediaId) => ({ id: mediaId })),
      },
    },
    include: getUserProjectData(user.id),
  });

  // IF NO EVENT
  if (!editedUserProject) {
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

  // RETURN JOB
  return editedUserProject;
}
