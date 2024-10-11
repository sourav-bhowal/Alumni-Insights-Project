"use client";
import { useState } from "react";
import AddUserProjectDialog from "./AddUserProjectForm";
import { Button } from "@/components/ui/button";

interface AddUserProjectButtonProps {
  userProfileProjectCount: number;
}

// Add upcoming event
export default function AddUserProjectButton({
  userProfileProjectCount,
}: AddUserProjectButtonProps) {
  // Show dialog state
  const [showDialog, setShowDialog] = useState(false);
  return (
    <div>
      <Button onClick={() => setShowDialog(true)} variant={"outline"}>
        Add Project
      </Button>
      <AddUserProjectDialog open={showDialog} onOpenChange={setShowDialog} userProfileProjectCount={userProfileProjectCount}/>
    </div>
  );
}
