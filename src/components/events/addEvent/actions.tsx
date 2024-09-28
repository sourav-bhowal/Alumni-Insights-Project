"use server";
import { prisma } from "@/lib/prisma";
import { getEventData } from "@/utils/types";
import { validateRequest } from "@/lib/auth";
import { createEventSchema } from "@/lib/validations";
import { UTApi } from "uploadthing/server";

// CREATE EVENT SERVER ACTION
export async function createEvent(inputValues: {
  event: {
    title: string;
    description: string;
    location: string;
    date: Date;
    type: string;
    time: string;
    registrationLink?: string;
  };
  mediaIds: string[];
}) {
  // GET USER FROM SESSION
  const { user } = await validateRequest();

  // IF NO USER
  if (!user) throw Error("Unauthorized");

  // IF USER IS NOT ADMIN
  if (!user.isAdmin) throw Error("Unauthorized");

  // VALIDATE INPUT VALUES
  const {
    title,
    description,
    location,
    date,
    type,
    time,
    registrationLink,
    mediaIds,
  } = createEventSchema.parse(inputValues);

  // CREATE EVENT
  const newEvent = await prisma.event.create({
    data: {
      title,
      description,
      location,
      date,
      time,
      type,
      registrationLink,
      attachments: {
        connect: mediaIds.map((mediaId) => ({ id: mediaId })),
      },
      userId: user.id,
    },
    include: getEventData(user.id),
  });

  // IF NO EVENT
  if (!newEvent) {
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
  }

  // RETURN EVENT
  return newEvent;
}
