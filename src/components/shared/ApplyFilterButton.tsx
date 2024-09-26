"use client";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

// APPLY FILTER BUTTON
export default function ApplyFilterButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  // GET FORM STATUS
  const { pending } = useFormStatus();
  // JSX
  return (
    <Button type="submit" {...props} disabled={pending || props.disabled}>
      {pending ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        props.children
      )}
    </Button>
  );
}
