"use client";
import { UserProjectData } from "@/utils/types";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../../ui/button";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import DeleteUserProjectDialog from "./delete-project/DeleteUserProject";
import EditUserProjectDialog from "./edit-project/EditUserProjectForm";

// TYPE OF MORE REFER JOB BUTTON PROPS
interface MoreUserProjectButtonProps {
  userProject: UserProjectData;
  className?: string;
}

// MORE USER PROJECT BUTTON COMPONENT
export default function UserProjectMoreButtons({
  userProject,
  className,
}: MoreUserProjectButtonProps) {
  // Show delete dailog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  // Show edit dailog state
  const [showEditDialog, setShowEditDialog] = useState(false);

  // JSX
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"icon"} variant={"ghost"} className={className}>
            <MoreHorizontal className="size-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <span className="flex items-center gap-3 text-primary">
              <Edit className="size-4" />
              Edit
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
            <span className="flex items-center gap-3 text-destructive">
              <Trash2 className="size-4" />
              Delete
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* DELETE  */}
      <DeleteUserProjectDialog
        userProject={userProject}
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      />
      {/* EDIT */}
      <EditUserProjectDialog
        userProject={userProject}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
    </>
  );
}
