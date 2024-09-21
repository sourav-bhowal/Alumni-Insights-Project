"use server";
import { prisma } from "@/lib/prisma";
// import streamServer from "@/lib/stream";
import { signUpSchema, SignUpSchemaType } from "@/lib/validations"
import { lucia } from "@/lib/auth";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// SIGN UP SERVER
export async function signUp(
  credentials: SignUpSchemaType,
): Promise<{ error: string }> {
  try {
    // VALIDATE CREDENTIALS
    const { username, email, password } = signUpSchema.parse(credentials);

    // HASH PASSWORD
    const hashedPassword = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    // GENERATE USER ID
    const userId = generateIdFromEntropySize(10);

    // IF USERNAME ALREADY EXISTS
    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (existingUser) {
      return { error: "Username already exists" };
    }

    // IF EMAIL ALREADY EXISTS
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (existingEmail) {
      return { error: "Email already exists" };
    }

    // PRISMA Transaction to create user and stream user
    await prisma.$transaction(async (tx) => {
      // CREATE USER
      await tx.user.create({
        data: {
          id: userId,
          username,
          displayName: email.split("@")[0],
          email,
          password: hashedPassword,
        },
      });
      // STREAM USER
      // await streamServer.upsertUser({
      //   id: userId,
      //   username,
      //   name: username,
      // });
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
    return redirect("/");
  } catch (error) {
    // HANDLE ERROR
    if (isRedirectError(error)) throw error;

    // LOG ERROR
    console.log(error);

    // RETURN ERROR
    return { error: "An unexpected error occurred. Please try again." };
  }
}
