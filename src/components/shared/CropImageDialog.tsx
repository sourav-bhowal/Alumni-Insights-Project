import { useRef } from "react";
import { Cropper, ReactCropperElement } from "react-cropper";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import "cropperjs/dist/cropper.css";

// CROP IMAGE COMPONENT PROPS
interface CropImageDialogProps {
  src: string;
  cropAspectRatio: number;
  onCropped: (blob: Blob | null) => void;
  onClose: () => void;
}

// CROP IMAGE COMPONENT
export default function CropImageDialog({
  src,
  cropAspectRatio,
  onCropped,
  onClose,
}: CropImageDialogProps) {
  // REF OF THE CROPPED IMAGE
  const croppedAvatarRef = useRef<ReactCropperElement>(null);

  // CROP FUNCTION TO CROP THE IMAGE
  function crop() {
    // Take the current image
    const cropper = croppedAvatarRef.current?.cropper;
    // If no image return
    if (!cropper) return;
    // If image crop it and set the onCropped
    cropper.getCroppedCanvas().toBlob((blob) => onCropped(blob), "image/webp");
    // Close the dialog
    onClose();
  }

  return (
    // CROP IMAGE DIALOG
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        {/* CROPPER FROM REACT CROPPER */}
        <Cropper
          src={src}
          aspectRatio={cropAspectRatio}
          guides={false}
          zoomable={false}
          ref={croppedAvatarRef}
          className="mx-auto size-fit"
        />
        <DialogFooter>
          <Button variant={"secondary"} onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={crop}>Crop</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
