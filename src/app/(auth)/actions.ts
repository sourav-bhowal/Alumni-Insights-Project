"use server";
import { lucia, validateRequest } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


// SIGN OUT USER FUNCTION (SERVER FUNCTION)
export async function signOut() {
    // GET SESSION
    const { session } = await validateRequest();

    if (!session) {
        throw new Error("Unauthorized");
    }

    // INVALIDATE SESSION
    await lucia.invalidateSession(session.id);

    // CREATE BLANK SESSION COOKIE
    const blankSession = lucia.createBlankSessionCookie();

    // SET SESSION
    cookies().set(blankSession.name, blankSession.value, blankSession.attributes);

    // REDIRECT TO HOME
    return redirect("/signin");
};