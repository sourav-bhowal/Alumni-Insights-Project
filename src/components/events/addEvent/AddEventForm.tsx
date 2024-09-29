import { useSession } from "@/context/SessionProvider";
import { useCreateEventMutation } from "./mutations";
import useMediaUpload from "@/hooks/useMediaUpload";
import { useDropzone } from "@uploadthing/react";
import { ClipboardEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { createEventSchema, CreateEventSchemaType } from "@/lib/validations";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
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
import { CalendarIcon, Loader2, Plus, PlusCircle } from "lucide-react";
import MediaUploadButton from "@/components/shared/MediaUploadButton";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
      type: undefined,
      time: "",
      registrationLink: "",
      mediaIds: [],
    },
  });

  // STEPS OF FORM
  // const steps = [
  //   { title: "Basic Info", fields: ["title", "description", "type"] },
  //   { title: "Date & Location", fields: ["location", "date", "time"] },
  //   { title: "Registration", fields: ["registrationLink"] },
  //   { title: "Media Upload", fields: [] },
  // ];

  // // CURRENT STEP STATE OF FORM
  // const [currentStep, setCurrentStep] = useState(0);

  // // HANDLE NEXT STEP
  // const handleNext = async () => {
  //   const fields = steps[currentStep].fields;
  //   const isValid = await form.trigger(fields as any);
  //   if (isValid) {
  //     setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  //   }
  // };

  // // HANDLE BACK STEP
  // const handleBack = () => {
  //   setCurrentStep((prev) => Math.max(prev - 1, 0));
  // };

  // SUBMIT FUNCTION
  async function onSubmit(data: CreateEventSchemaType) {
    mutation.mutate(
      {
        event: {
          ...data,
          mediaIds: medias
            .map((media) => media.mediaId)
            .filter(Boolean) as string[],
        },
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
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add an Upcoming Event</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Column 1 */}
              <div className="space-y-4">
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
                        <Select {...field} defaultValue="">
                          <option value="">Select type of event</option>
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
              </div>

              {/* Column 2 */}
              <div className="space-y-4">
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
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
              </div>

              {/* Column 3 */}
              <div className="space-y-4">
                <FormLabel className="text-lg font-semibold">Media</FormLabel>
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
            </div>

            <div className="flex justify-end">
              <Button
                disabled={isUploading || !form.formState.isValid}
                type="submit"
              >
                {mutation.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Create Event"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
