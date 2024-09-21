import { prisma } from "@/lib/prismaDB";
import { validateRequest } from "@/utils/auth";
import { FollowerInfo } from "@/utils/types";

// GET IF U FOLLOW OR NOT
export async function GET(
  request: Request,
  { params: { userId } }: { params: { userId: string } },
) {
  try {
    // get user
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        followers: {
          where: {
            followerId: loggedInUser.id,
          },
          select: {
            followerId: true,
          },
        },
        _count: {
          select: {
            followers: true,
          },
        },
      },
    });

    if (!user) {
      return Response.json({ error: "user not found" }, { status: 404 });
    }
    // DATA
    const data: FollowerInfo = {
      followers: user._count.followers,
      isFollowedByUser: !!user.followers.length,
    };

    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// CREATE FOLLOW
export async function POST(
  request: Request,
  { params: { userId } }: { params: { userId: string } },
) {
  try {
    // get user
    const { user: loggedInUser } = await validateRequest();
    // if not logged in
    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // create transaction
    await prisma.$transaction([
      // upsert will create a follow if u dont follow otherwise ignore it
      prisma.follow.upsert({
        where: {
          followerId_followingId: {
            followerId: loggedInUser.id,
            followingId: userId,
          },
        },
        create: {
          followerId: loggedInUser.id,
          followingId: userId,
        },
        update: {},
      }),

      // send notification
      prisma.notification.create({
        data: {
          type: "FOLLOW",
          issuerId: loggedInUser.id,
          recipientId: userId,
        },
      }),
    ]);

    return new Response();
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE A FOLLOWER
export async function DELETE(
  request: Request,
  { params: { userId } }: { params: { userId: string } },
) {
  try {
    // get user
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // delete transaction
    await prisma.$transaction([
      // delete a follow
      prisma.follow.deleteMany({
        where: {
          followerId: loggedInUser.id,
          followingId: userId,
        },
      }),

      // send notification
      prisma.notification.create({
        data: {
          type: "FOLLOW",
          issuerId: loggedInUser.id,
          recipientId: userId,
        },
      }),
    ]);

    return new Response();
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
