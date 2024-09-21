import { Metadata } from "next";
import signupImage from "@/assets/signup-image.jpg";
import Image from "next/image";
import Link from "next/link";
import SignUpForm from "./SignUpForm";
import GoogleLoginButton from "../GoogleLoginButton";

// METADATA
export const metadata: Metadata = {
  title: "Sign Up",
};

// SIGN UP PAGE
export default function SignUpPage() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-center text-2xl font-bold tracking-wide md:text-4xl">
              Create Account
            </h1>
            <p className="text-xs text-muted-foreground md:text-sm">
              Get started with your account
            </p>
          </div>
          <div className="space-y-5">
            <GoogleLoginButton />
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-muted" />
              <span>OR</span>
              <div className="h-px flex-1 bg-muted" />
            </div>
            <SignUpForm />
            <Link href="/signin" className="block text-center hover:underline">
              Already have an account? Sign in
            </Link>
          </div>
        </div>
        <div className="relative hidden w-1/2 md:block">
          <Image src={signupImage} alt="image" className="object-cover h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50" />
          <div className="absolute bottom-0 mb-8 ml-6 w-[90%]">
            <h2 className="mb-5 text-4xl font-bold capitalize">
              Reconnect with your alumni Network
            </h2>
            <p>
              Join your fellow graduates and stay connected with your university
              community.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
