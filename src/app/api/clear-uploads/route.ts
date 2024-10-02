import { prisma } from "@/lib/prisma";
import { UTApi } from "uploadthing/server";

// CLEAR UPLOADS ROUTE
export async function GET(request: Request) {
  try {
    // Headers check
    const authHeader = request.headers.get("Authorization");
    // Check if header is valid
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return Response.json(
        { error: "Invalid authorization header" },
        { status: 401 },
      );
    }

    // Clear uploads
    const unusedMedia = await prisma.attachment.findMany({
      where: {
        // Only delete media older than 24 hours if in production
        ...(process.env.NODE_ENV === "production"
          ? {
              createdAt: {
                lte: new Date(Date.now() - 1000 * 60 * 60 * 24),
              },
            }
          : {}),
      },
      select: {
        id: true,
        url: true,
      },
    });

    // Delete media from uploadthing
    new UTApi().deleteFiles(
      // map media urls to key for uploadthing
      unusedMedia.map(
        (media) =>
          media.url.split(
            `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
          )[1],
      ),
    );

    // Delete media from database
    await prisma.attachment.deleteMany({
      where: {
        id: {
          in: unusedMedia.map((media) => media.id),
        },
      },
    });

    // Return success
    return new Response();
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
