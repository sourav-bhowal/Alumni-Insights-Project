import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { getUserData } from "@/utils/types";

// GET USER
export async function GET(
  request: Request,
  { params: { username } }: { params: { username: string } },
) {
  try {
    // get user
    const { user: loggedInUser } = await validateRequest();

    // if not logged in
    if (!loggedInUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    // fetch user
    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
      select: getUserData(loggedInUser.id),
    });

    // if not found
    if (!user)
      return Response.json({ error: "User not found" }, { status: 404 });

    // return user
    return Response.json(user);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
