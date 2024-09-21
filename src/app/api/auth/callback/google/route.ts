import { prisma } from "@/lib/prismaDB";
import streamServer from "@/lib/stream";
import { google, lucia } from "@/utils/auth";
import { kyInstance } from "@/utils/ky";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

// GET GOOGLE AUTHORIZATION ROUTE
export async function GET(request: NextRequest) {
  // GET GOOGLE CODE
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  // GET STORED STATE AND CODE VERIFIER
  const storedState = cookies().get("state")?.value;
  const storedCodeVerifier = cookies().get("code_verifier")?.value;

  // CHECK IF STATE AND CODE VERIFIER ARE VALID
  if (
    !code ||
    !state ||
    !storedState ||
    !storedCodeVerifier ||
    state !== storedState
  ) {
    return new Response(null, { status: 400 });
  }

  // VALIDATE GOOGLE CODE
  try {
    const tokens = await google.validateAuthorizationCode(
      code,
      storedCodeVerifier,
    );

    // GET GOOGLE USER
    const googleUser = await kyInstance
      .get("https://www.googleapis.com/oauth2/v1/userinfo", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      })
      .json<{ id: string; name: string }>();

    // CHECK IF USER ALREADY EXISTS
    const existingUser = await prisma.user.findUnique({
      where: {
        googleId: googleUser.id,
      },
    });

    // IF USER ALREADY EXISTS SET SESSION AND REDIRECT
    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );

      return new Response(null, { status: 302, headers: { location: "/" } });
    }

    // CREATE USER //

    // generate user id
    const userId = generateIdFromEntropySize(10);
    // generate username
    const username =
      googleUser.name
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^a-z0-9-]/g, "") +
      "-" +
      userId.slice(0, 5);

    // PRISMA Transaction to create user and stream user
    await prisma.$transaction(async (tx) => {
      // CREATE USER
      await tx.user.create({
        data: {
          id: userId,
          username,
          name: googleUser.name,
          googleId: googleUser.id,
        },
      });
      // STREAM USER
      await streamServer.upsertUser({
        id: userId,
        username,
        name: username,
      });
    });

    // CREATE SESSION
    const session = await lucia.createSession(userId, {});

    // CREATE SESSION COOKIE
    const sessionCookie = lucia.createSessionCookie(session.id);

    // SET SESSION COOKIE
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    // REDIRECT TO HOME
    return new Response(null, { status: 302, headers: { location: "/" } });
  } catch (error) {
    console.error(error);
    // IF Oauth Error
    if (error instanceof OAuth2RequestError) {
      return new Response(null, { status: 400 });
    }

    // IF Unknown Error
    return new Response(null, { status: 500 });
  }
}
