import UserAvatar from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import { Mail, MapPin } from "lucide-react";
import Link from "next/link";
import React from "react";

// INTERFACE FOR MENTOR LIST
interface AlumniCardProps {
  alumni: User;
}

// MENTOR LIST COMPONENT
export default function AlumniCard({
  alumni: { bio, email, location, avatarUrl, username },
}: AlumniCardProps) {
  return (
    <article className="w-full rounded-xl bg-card text-black dark:text-white">
      <div className="flex flex-col items-center px-4 pb-6 pt-6">
        <div className="mb-4 h-24 w-24 overflow-hidden rounded-full">
          <UserAvatar avatarUrl={avatarUrl} size={96} />
        </div>
        <h2 className="mb-1 text-xl font-semibold capitalize">{username}</h2>
        <p className="mb-4 text-sm text-zinc-400">
          {bio ? bio : "Senior UX Consultant"}
        </p>
        <div className="mt-2 w-full space-y-2">
          <div className="flex items-center text-sm">
            <MapPin className="mr-2 h-4 w-4 text-primary" />
            <span>{location ? location : "New Jersey, USA"}</span>
          </div>
          <div className="flex items-center text-sm">
            <Mail className="mr-2 h-4 w-4 text-primary" />
            <span>{email}</span>
          </div>
        </div>
      </div>
      <footer className="px-4 pb-4">
        <Link href={`/users/${username}`}>
          <Button className="w-full bg-primary text-white hover:bg-orange-600">
            Show Profile
          </Button>
        </Link>
      </footer>
    </article>
  );
}
