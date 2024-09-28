import { prisma } from "@/lib/prisma";
// import streamServer from "@/lib/stream";
import { validateRequest } from "@/lib/auth";
import { createUploadthing, FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

// Initailize uploadthing
const f = createUploadthing();

// FileRouter to upload files and routes
export const fileRouter = {
  // upload 1 avatar file to uploadthing
  avatar: f({
    image: {
      maxFileSize: "512KB",
    },
  })
    // middle wares for user auth
    .middleware(async () => {
      // validate user from Context
      const { user } = await validateRequest();
      // if user not found throw error
      if (!user) throw new UploadThingError("Unauthorized");
      // return user to next middleware
      return { user };
    })
    // onUploadComplete save to DB
    .onUploadComplete(async ({ metadata, file }) => {
      // delete old avatar from uploadthing
      const oldAvatarUrl = metadata.user.avatarUrl;
      // if old avatar exists
      if (oldAvatarUrl) {
        // get key from url
        const key = oldAvatarUrl.split(
          `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
        )[1];

        // delete old avatar from uploadthing
        await new UTApi().deleteFiles(key);
      }

      // Create Secure url of the avatar
      const newAvatarUrl = file.url.replace(
        "/f/",
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
      );

      // Do the following Promises
      await Promise.all([
        // update user avatar url and save to DB
        prisma.user.update({
          where: {
            id: metadata.user.id,
          },
          data: {
            avatarUrl: newAvatarUrl,
          },
        }),
        // update stream server avatar url
        // streamServer.partialUpdateUser({
        //   id: metadata.user.id,
        //   set: {
        //     image: newAvatarUrl,
        //   },
        // }),
      ]);

      // return new avatar url to client
      return { avatarUrl: newAvatarUrl };
    }),
  // Upload multiple post media files to uploadthing
  media: f({
    image: {
      maxFileSize: "32MB",
      maxFileCount: 5,
    },
    video: {
      maxFileSize: "64MB",
      maxFileCount: 5,
    },
    pdf: {
      maxFileSize: "8MB",
      maxFileCount: 5,
    },
  })
    // middle wares for user auth
    .middleware(async () => {
      // validate user from Context
      const { user } = await validateRequest();
      // if user not found throw error
      if (!user) throw new UploadThingError("Unauthorized");

      return {};
    })
    // onUploadComplete save media files to DB
    .onUploadComplete(async ({ file }) => {
      const media = await prisma.attachment.create({
        data: {
          // secure url of the media
          url: file.url.replace(
            "/f/",
            `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
          ),
          // type of media
          type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
        },
      });
      // return media id to client
      return { mediaId: media.id };
    }),
} satisfies FileRouter;

// export app file route
export type AppFileRouter = typeof fileRouter;
