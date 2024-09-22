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
import DeleteReferjobDialogue from "./deleteJob/DeleteReferJob";
// import EditPostDialog from "./editPost/editPostDialog";

interface MoreReferJobButtonProps {
  referJob: ReferJobData;
  className?: string;
}

export default function ReferJobMoreButtons({
  referJob,
  className,
}: MoreReferJobButtonProps) {
  // Show delete dailog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

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
      <DeleteReferjobDialogue
        referJob={referJob}
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      />
      {/* <EditPostDialog
       post={post}
       open={showEditDialog}
       onOpenChange={setShowEditDialog}
      /> */}
    </>
  );
}
