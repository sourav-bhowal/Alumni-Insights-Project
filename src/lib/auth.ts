import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { prisma } from "../lib/prisma";
import { Lucia, Session, User } from "lucia";
import { cache } from "react";
import { cookies } from "next/headers";
import { Google } from "arctic";

// TYPES FOR DB USER
interface DatabaseUserAttributes {
  id: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  googleId: string | null;
}

// GOOGLE OAuth INSTANCE
export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`,
);

// MODULE FOR LUCIA
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

// PRISMA ADAPTER
const adapter = new PrismaAdapter(prisma.session, prisma.user);

// LUCIA CONFIG
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes(databaseUserAttributes) {
    return {
      id: databaseUserAttributes.id,
      username: databaseUserAttributes.username,
      name: databaseUserAttributes.name,
      avatarUrl: databaseUserAttributes.avatarUrl,
      googleId: databaseUserAttributes.googleId,
    };
  },
});

// VALIDATE SESSION REQUEST CACHE
export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    // Get session from cookie
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId) {
      return { user: null, session: null };
    }

    // VALIDATE SESSION
    const result = await lucia.validateSession(sessionId);

    // CREATE & SET SESSION
    try {
      if (result.session && result.session.fresh) {
        // CREATE SESSION
        const sessionCookie = lucia.createSessionCookie(result.session.id);

        // SET SESSION
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }

      if (!result.session) {
        // IF NOT SESSION
        const sessionCookie = lucia.createBlankSessionCookie();

        // SET BLANK SESSION
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch {}

    // RETURN RESULT
    return result;
  },
);