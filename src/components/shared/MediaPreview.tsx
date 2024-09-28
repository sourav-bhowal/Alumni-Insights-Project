import { cn } from "@/lib/utils";
import { MediaUploadProps } from "@/hooks/useMediaUpload";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

// MEDIA UPLOAD PREVIEWS PROPS
interface MediaPreviewsProps {
  medias: MediaUploadProps[];
  removeMedia: (fileName: string) => void;
}

// MEDIA UPLOAD PREVIEWS COMPONENT
export function MediaPreviews({ medias, removeMedia }: MediaPreviewsProps) {
  // RETURN
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        medias.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {medias.map((media) => (
        <MediaPreview
          key={media.file.name}
          media={media}
          onRemoveClick={() => removeMedia(media.file.name)}
        />
      ))}
    </div>
  );
}

// MEDIA UPLOAD PREVIEW PROPS
interface MediaPreviewProps {
  media: MediaUploadProps;
  onRemoveClick: () => void;
}

// MEDIA UPLOAD PREVIEW COMPONENT
export function MediaPreview({
  media: { mediaId, file, isUploading },
  onRemoveClick,
}: MediaPreviewProps) {
  // src to file
  const src = URL.createObjectURL(file);

  // RETURN
  return (
    <div
      className={cn("relative mx-auto size-fit", isUploading && "opacity-50")}
    >
      {file.type.startsWith("image") ? (
        <Image
          src={src}
          alt="Preview"
          className="size-fit max-h-[30rem] rounded-2xl"
          width={500}
          height={500}
        />
      ) : (
        <video controls className="size-fit max-h-[30rem] rounded-2xl">
          <source src={src} type={file.type} />
        </video>
      )}
      {!isUploading && (
        <Button
          variant={"ghost"}
          onClick={onRemoveClick}
          className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-foreground/60"
          size={"icon"}
        >
          <X size={20} />
        </Button>
      )}
    </div>
  );
}
