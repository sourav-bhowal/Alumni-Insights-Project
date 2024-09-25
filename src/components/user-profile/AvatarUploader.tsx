import { Camera, Loader2, XIcon } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import CropImageDialog from "@/components/shared/CropImageDialog";
import Resizer from "react-image-file-resizer";


// AVATAR UPLOADER PROPS
interface AvatarUploaderProps {
    src: string | StaticImageData;
    onImageCropped: (blob: Blob | null) => void;
  }
  
  // AVATAR UPLOADER COMPONENT
  export function AvatarUploader({ src, onImageCropped }: AvatarUploaderProps) {
    // Image to crop state
    const [imageToCrop, setImageToCrop] = useState<File>();
  
    // Ref to input field
    const avatarFileInputRef = useRef<HTMLInputElement>(null);
  
    // Handle image change
    function onImageSelected(image: File | undefined) {
      // If no image is selected
      if (!image) return;
      // Resize the image with "Resizer"
      Resizer.imageFileResizer(
        image,
        1024,
        1024,
        "WEBP",
        100,
        0,
        (uri) => setImageToCrop(uri as File), // The file resizer return the uri of the image. So we need to convert it to a file
        "file",
      );
    }
  
    // RETURN
    return (
      <>
        {/* Avatar file input */}
        <input
          type="file"
          accept="image/*"
          ref={avatarFileInputRef}
          onChange={(e) => onImageSelected(e.target.files?.[0])}
          className="sr-only hidden"
        />
        <button
          type="button"
          onClick={() => avatarFileInputRef.current?.click()} // Open file input
          className="group relative block"
        >
          <Image
            src={src}
            alt="Avatar"
            width={150}
            height={150}
            className="size-32 flex-none rounded-full object-cover"
          />
          <span className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-black bg-opacity-30 text-white transition-colors duration-200 group-hover:bg-opacity-25">
            <Camera size={24} />
          </span>
        </button>
  
        {/* IF A IMAGE IS SELECTED  CROP COMPONENT IS RENDERED */}
        {imageToCrop && (
          <CropImageDialog
            src={URL.createObjectURL(imageToCrop)}
            cropAspectRatio={1}
            onCropped={onImageCropped}
            onClose={() => {
              setImageToCrop(undefined);
              if (avatarFileInputRef.current) {
                avatarFileInputRef.current.value = "";
              }
            }}
          />
        )}
      </>
    );
  }