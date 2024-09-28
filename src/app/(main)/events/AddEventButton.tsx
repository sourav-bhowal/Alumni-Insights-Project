"use client";
import AddEventDialog from "../../../components/events/addEvent/AddEventForm";
import React, { useState } from "react";

// Add upcoming event
export default function AddEventButton() {
  // Show dialog state
  const [showDialog, setShowDialog] = useState(false);
  return (
    <div>
      <button
        onClick={() => setShowDialog(true)}
        className="rounded bg-primary px-4 py-2 text-white"
      >
        Post Upcoming Event
      </button>
      <AddEventDialog open={showDialog} onOpenChange={setShowDialog} />
    </div>
  );
}
