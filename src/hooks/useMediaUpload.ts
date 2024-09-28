import { useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { useState } from "react";

// POST MEDIA UPLOAD PROPS
export interface MediaUploadProps {
  file: File;
  mediaId?: string;
  isUploading: boolean;
}

// POST MEDIA UPLOAD COMPONENT
export default function useMediaUpload() {
  // toast
  const { toast } = useToast();
  // State for media upload
  const [medias, setMedias] = useState<MediaUploadProps[]>([]);
  // State for media upload progress
  const [uploadProgress, setUploadProgress] = useState<number>();

  // UploadThing function to upload media
  const { startUpload, isUploading } = useUploadThing("media", {
    // BEFORE UPLOAD BEGIN
    onBeforeUploadBegin(files) {
      // rename files
      const renamedFiles = files.map((file) => {
        // get file extension from file name and rename it
        const fileExtension = file.name.split(".").pop();
        // return new file with new name and extension
        return new File(
          [file],
          `media_${crypto.randomUUID()}.${fileExtension}`,
          { type: file.type },
        );
      });

      // set media to renamed files
      setMedias((prev) => [
        ...prev,
        ...renamedFiles.map((file) => ({
          file,
          isUploading: true,
        })),
      ]);

      // return renamed files
      return renamedFiles;
    },
    // UPLOAD PROGRESS
    onUploadProgress: setUploadProgress,

    // ON CLIENT UPLOAD COMPLETE
    onClientUploadComplete(res) {
      // set media to res
      setMedias((prev) =>
        prev.map((media) => {
          // find media in res
          const uploadResult = res.find(
            (result) => result.name === media.file.name,
          );
          // if upload result is not found, return media
          if (!uploadResult) return media;
          // return media with mediaId and isUploading set to false
          return {
            ...media,
            mediaId: uploadResult.serverData.mediaId,
            isUploading: false,
          };
        }),
      );
    },

    // ON UPLOAD ERROR
    onUploadError(error) {
      // set media to media.filter((media) => !media.isUploading)
      setMedias((prev) => prev.filter((media) => !media.isUploading));
      // show toast
      toast({
        title: "Error",
        description: "An error occurred while uploading your media.",
        variant: "destructive",
      });
    },
  });

  // FUNCTION TO HANDLE START UPLOAD MEDIA
  function handleStartUpload(files: File[]) {
    // if uploading, return
    if (isUploading) {
      toast({
        title: "Error",
        description: "Please wait for the current upload to finish.",
        variant: "destructive",
      });
      return;
    }
    // if media.length + file.length > 5, return
    if (medias.length + files.length > 5) {
      toast({
        title: "Error",
        description: "You can only upload a maximum of 5 files.",
        variant: "destructive",
      });
      return;
    }

    // start upload files
    startUpload(files);
  }

  // FUNCTION TO REMOVE MEDIA
  function removeMedia(fileName: string) {
    // set media to media.filter((media) => media.file.name !== fileName)
    setMedias((prev) => prev.filter((media) => media.file.name !== fileName));
  }

  // FUNCTION TO RESET MEDIA
  function resetMediaUploads() {
    setMedias([]);
    setUploadProgress(undefined);
  }

  // RETURN MEDIA UPLOAD PROPS
  return {
    medias,
    uploadProgress,
    startUpload: handleStartUpload,
    removeMedia,
    isUploading,
    resetMediaUploads,
  };
}
