"use client";
import { Button } from "@/components/ui/button";
import { UserData } from "@/utils/types";
import { useState } from "react";
import EditProfileDialog from "./EditProfileDialog";

// EDIT PROFILE BUTTON PROPS
interface EditProfileButtonProps {
  user: UserData;
}

// EDIT PROFILE BUTTON COMPONENT
export default function EditProfileButton({ user }: EditProfileButtonProps) {
  // Dialog box state
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      {/* EDIT PROFILE BUTTON */}
      <Button variant={"outline"} onClick={() => setShowDialog(true)}>
        Edit Profile
      </Button>
      {/* EDIT PROFILE DIALOG */}
      <EditProfileDialog
        user={user}
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
}
