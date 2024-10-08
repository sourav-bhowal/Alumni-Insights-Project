import { ReferJobData, UserProjectData } from "@/utils/types";
import { useDeleteUserProjectMutation } from "./mutations";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// TYPE OF DELETE REFER JOB DIALOGUE PROPS
interface DeleteUserProjectDialogueProps {
  userProject: UserProjectData;
  open: boolean;
  onClose: () => void;
}

// DELETE POST DIALOGUE
export default function DeleteUserProjectDialogue({
  userProject,
  open,
  onClose,
}: DeleteUserProjectDialogueProps) {
  // delete mutation
  const mutation = useDeleteUserProjectMutation();

  // handle open
  function handleOpenChange(open: boolean) {
    if (!open || !mutation.isPending) {
      onClose();
    }
  }
  // JSX
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete project?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="destructive"
            onClick={() =>
              mutation.mutate(userProject.id, {
                onSuccess: onClose,
              })
            }
          >
            {mutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Delete"
            )}
          </Button>
          <Button
            variant={"outline"}
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
