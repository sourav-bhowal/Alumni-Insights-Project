import { useSession } from "@/context/SessionProvider";
import { useCreateEventMutation } from "./mutations";
import useMediaUpload from "@/hooks/useMediaUpload";
import { useDropzone } from "@uploadthing/react";
import { ClipboardEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { createEventSchema, CreateEventSchemaType } from "@/lib/validations";
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
import Select from "@/components/ui/select";
import { MediaPreviews } from "@/components/shared/MediaPreview";
import { Loader2 } from "lucide-react";
import MediaUploadButton from "@/components/shared/MediaUploadButton";
import { Button } from "@/components/ui/button";

// Interface for Add Event Props
interface AddEventProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Add Event Component
export default function AddEventDialog({ open, onOpenChange }: AddEventProps) {
  // TAKE USER FORM SESSION CONTEXT
  const { user } = useSession();

  // USE MUTATION
  const mutation = useCreateEventMutation();

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

  // FUNCTION TO PASTE MEDIA TO EDITOR
  function pasteMedia(e: ClipboardEvent<HTMLInputElement>) {
    // Get files from clipboard data and start upload files
    const files = Array.from(e.clipboardData.items)
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile()) as File[];

    // Start upload files
    startUpload(files);
  }

  // FORM
  const form = useForm<CreateEventSchemaType>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      date: new Date(),
      type: "workshop",
      time: "",
      registrationLink: "",
    },
  });

  // STEPS OF FORM
  const steps = [
    { title: "Basic Info", fields: ["title", "description", "type"] },
    { title: "Date & Location", fields: ["location", "date", "time"] },
    { title: "Registration", fields: ["registrationLink"] },
    { title: "Media Upload", fields: [] },
  ];

  // CURRENT STEP STATE OF FORM
  const [currentStep, setCurrentStep] = useState(0);

  // HANDLE NEXT STEP
  const handleNext = async () => {
    const fields = steps[currentStep].fields;
    const isValid = await form.trigger(fields as any);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  // HANDLE BACK STEP
  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // SUBMIT FUNCTION
  async function onSubmit(data: CreateEventSchemaType) {
    mutation.mutate(
      {
        event: data,
        mediaIds: medias
          .map((media) => media.mediaId)
          .filter(Boolean) as string[],
      },
      // ON SUCCESS FUNCTION
      {
        onSuccess: () => {
          form.reset();
          resetMediaUploads();
          onOpenChange(false);
        },
      },
    );
  }

  // JSX
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add an Upcoming Event - Step {currentStep + 1}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {currentStep === 0 && (
                <>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter the title of the event"
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
                            placeholder="Enter the description of the event"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                          <Select {...field} defaultValue={""}>
                            <option value="workshop">Workshop</option>
                            <option value="webinar">Webinar</option>
                            <option value="conference">Conference</option>
                            <option value="seminar">Seminar</option>
                            <option value="reunion">Reunion</option>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {currentStep === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter the location of the event"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            value={
                              field.value instanceof Date
                                ? field.value.toISOString().split("T")[0]
                                : ""
                            }
                            onChange={(e) =>
                              field.onChange(new Date(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {currentStep === 2 && (
                <FormField
                  control={form.control}
                  name="registrationLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration Link</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter the registration link"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <FormLabel className="text-lg font-semibold">Media</FormLabel>
                  <div
                    {...getRootProps()}
                    className="w-full cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                  >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <p className="text-gray-500">Drop the files here ...</p>
                    ) : (
                      <p className="text-gray-500">
                        Drag and drop files here, or click to select files
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {!!medias.length && (
                      <MediaPreviews
                        medias={medias}
                        removeMedia={removeMedia}
                      />
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
              )}
              <div className="mt-6 flex justify-between">
                {currentStep > 0 && (
                  <Button type="button" onClick={handleBack}>
                    Back
                  </Button>
                )}
                {currentStep < steps.length - 1 ? (
                  <Button type="button" onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={isUploading}>
                    {mutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
