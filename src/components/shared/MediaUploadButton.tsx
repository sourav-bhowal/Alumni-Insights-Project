import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";
import { useRef } from "react";

// MEDIA PREVIEW BUTTON PROPS
interface MediaUploadButtonProps {
  onFilesSelected: (files: File[]) => void;
  disabled: boolean;
}

// MEDIA PREVIEW BUTTON
export default function MediaUploadButton({
  onFilesSelected,
  disabled,
}: MediaUploadButtonProps) {
  // FILE INPUT REF
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        variant={"default"}
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
        className=""
      >
        Upload Media
      </Button>

      <input
        type="file"
        accept="image/*, video/*"
        multiple
        ref={fileInputRef}
        onChange={(e) => {
          // If no files are selected, return
          if (!e.target.files) return;
          // Call onFilesSelected with the selected files
          onFilesSelected(Array.from(e.target.files));
          // Clear the input
          e.target.value = "";
        }}
        className="hidden"
      />
    </>
  );
}
