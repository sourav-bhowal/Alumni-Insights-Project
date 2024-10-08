import { cn } from "@/lib/utils";
import { UserData } from "@/utils/types";
import { GraduationCapIcon, Scroll, UserCheck2Icon } from "lucide-react";

// INTERFACE OF USER BADGE
interface UserBadgeProps {
  user: UserData;
  className?: string;
}

// USER BADGE COMPONENT
export default async function UserBadge({ user, className }: UserBadgeProps) {
  return (
    <div className={cn("flex gap-2", className)}>
      {user.isAlumni && (
        <div className="flex items-center gap-1 rounded-full bg-cyan-500/20 pl-4 pr-4 font-semibold text-cyan-500">
          <Scroll size={20} />
          <span>Alumni</span>
        </div>
      )}
      {user.isMentor && (
        <div className="flex items-center gap-1 rounded-full bg-red-500/20 p-2 pl-4 pr-4 font-semibold text-red-500">
          <GraduationCapIcon size={20} />
          <span>Mentor</span>
        </div>
      )}
      {!user.isAlumni && (
        <div className="flex items-center gap-1 rounded-full bg-green-500/20 p-2 pl-4 pr-4 font-semibold text-green-500">
          <UserCheck2Icon size={20} />
          <span>Student</span>
        </div>
      )}
    </div>
  );
}
