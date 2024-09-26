import { ReferJobData } from "@/utils/types";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import DeleteReferjobDialogue from "./deleteReferJob/DeleteReferJob";
import EditReferJobDialogue from "./editReferJob/EditReferJob";

// TYPE OF MORE REFER JOB BUTTON PROPS
interface MoreReferJobButtonProps {
  referJob: ReferJobData;
  className?: string;
}

// MORE REFER JOB BUTTONS COMPONENT
export default function ReferJobMoreButtons({
  referJob,
  className,
}: MoreReferJobButtonProps) {
  // Show delete dailog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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
      <DeleteReferjobDialogue
        referJob={referJob}
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      />
      {/* EDIT */}
      <EditReferJobDialogue
        referJob={referJob}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
    </>
  );
}
