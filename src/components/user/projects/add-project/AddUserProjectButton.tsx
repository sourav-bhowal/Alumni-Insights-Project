"use client";
import { useState } from "react";
import AddUserProjectDialog from "./AddUserProjectForm";
import { Button } from "@/components/ui/button";

// Add upcoming event
export default function AddUserProjectButton() {
  // Show dialog state
  const [showDialog, setShowDialog] = useState(false);
  return (
    <div>
      <Button
        onClick={() => setShowDialog(true)}
        variant={"outline"}
      >
        Add Project
      </Button>
      <AddUserProjectDialog open={showDialog} onOpenChange={setShowDialog} />
    </div>
  );
}
