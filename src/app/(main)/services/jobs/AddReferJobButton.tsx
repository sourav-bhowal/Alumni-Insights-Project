"use client";
import AddReferJobDialog from "@/components/jobs/addReferJob/AddReferJob";
import React, { useState } from "react";

// Add Refer Job Button
export default function AddReferJobButton() {
  // Show dialog state
  const [showDialog, setShowDialog] = useState(false);
  return (
    <div>
      <button
        onClick={() => setShowDialog(true)}
        className="rounded bg-primary px-4 py-2 text-white"
      >
        Add Refer Job
      </button>
      <AddReferJobDialog open={showDialog} onOpenChange={setShowDialog} />
    </div>
  );
}
