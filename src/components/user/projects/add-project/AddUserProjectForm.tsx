import { useSession } from "@/context/SessionProvider";
import { useForm } from "react-hook-form";
import useMediaUpload from "@/hooks/useMediaUpload";
import { useDropzone } from "@uploadthing/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MediaPreviews } from "@/components/shared/MediaPreview";
import { Button } from "@/components/ui/button";
import { useCreateUserProjectMutation } from "./mutations";
import {
  createUserProjectSchema,
  CreateUserProjectSchemaType,
} from "@/lib/validations";
import { Loader2, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { prisma } from "@/lib/prisma";
import { useToast } from "@/components/ui/use-toast";

// Interface for Add User Project Props
interface AddUserProjectProps {
  userProfileProjectCount: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Add User project Component
export default function AddUserProjectDialog({
  userProfileProjectCount,
  open,
  onOpenChange,
}: AddUserProjectProps) {
  // TAKE USER FORM SESSION CONTEXT
  const { user } = useSession();

  // TOAST HOOK
  const { toast } = useToast();

  // USE MUTATION
  const mutation = useCreateUserProjectMutation();

  // MEDIA UPLOAD HOOK
  const {
    medias,
    uploadProgress,
    startUpload,
    removeMedia,
    isUploading,
    resetMediaUploads,
  } = useMediaUpload();

  // DRAG AND DROP FUNCTION TO START MEDIA UPLOAD USING USEDROPZONE By uploadthing
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: startUpload,
  });

  // We have to ignore onClick event because of useDropzone
  const { onClick, ...rootProps } = getRootProps();

  // FORM HOOK
  const form = useForm<CreateUserProjectSchemaType>({
    resolver: zodResolver(createUserProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      link: "",
      mediaIds: [],
      showInProfile: false,
    },
  });

  // ON FORM SUBMIT
  async function onSubmit(values: CreateUserProjectSchemaType) {
    // IF PROFILE PROJECTS COUNT IS 4
    if (values.showInProfile && userProfileProjectCount >= 4) {
      toast({
        title: "Profile Projects Limit",
        description: "You can only show 4 projects on your profile.",
        variant: "destructive",
      });
      return;
    }
    // CALL MUTATION
    mutation.mutate(
      {
        ...values,
        mediaIds: medias
          .map((media) => media.mediaId)
          .filter(Boolean) as string[],
      },
      // ON SUCCESS CALLBACK
      {
        onSuccess: () => {
          resetMediaUploads();
          form.reset();
          onOpenChange(false);
        },
      },
    );
  }

  // RENDER
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add your Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the title of your project"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the description of your project"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the project link" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="showInProfile"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Input
                      type="checkbox"
                      className="h-5 w-5 accent-primary"
                      {...field}
                      value={field.value ? "true" : "false"}
                      disabled={userProfileProjectCount >= 4}
                    />
                  </FormControl>
                  <FormLabel className="text-start">Show in profile</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel className="font-semibold">Media</FormLabel>
              <div
                {...getRootProps()}
                className="w-full cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-gray-500">Drop the files here ...</p>
                ) : (
                  <>
                    <PlusCircle className="mx-auto h-8 w-8 text-primary" />
                    <p className="text-gray-500">
                      Drag and drop files here, or click to select files
                    </p>
                  </>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {!!medias.length && (
                  <MediaPreviews medias={medias} removeMedia={removeMedia} />
                )}
                {!!medias.length && (
                  <>
                    {form.setValue(
                      "mediaIds",
                      medias
                        .map((media) => media?.mediaId)
                        .filter((id) => id !== undefined),
                    )}
                    {/* {console.log(form.getValues("mediaIds"))} */}
                  </>
                )}
              </div>
              {isUploading && (
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="h-5 w-5 animate-spin text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                  <p className="text-gray-500">{uploadProgress}%</p>
                </div>
              )}
            </div>
            <Button
              disabled={isUploading || !form.formState.isValid}
              type="submit"
            >
              {mutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Add Project"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
