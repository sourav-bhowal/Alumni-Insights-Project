import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateUserSchema, UpdateUserSchemaType } from "@/lib/validations";
import { UserData } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useUpdateUserProfileMutation } from "./mutations";
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
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import CropImageDialog from "@/components/shared/CropImageDialog";
import Resizer from "react-image-file-resizer";
import { fetchSkills } from "./page";
import MultiSelect from "./MultiSelect";

// EDIT PROFILE DIALOG PROPS
interface EditProfileDialogProps {
  user: UserData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// EDIT PROFILE DIALOG COMPONENT
export default function EditProfileDialog({
  user,
  open,
  onOpenChange,
}: EditProfileDialogProps) {
  // Form for edit profile
  const form = useForm<UpdateUserSchemaType>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: user.username,
      displayName: user.displayName,
      location: user.location || "",
      bio: user.bio || "",
      skills: user.skills || [],
      yearOfGrad: user.yearOfGrad || 0,
    },
  });

  const [skills, setSkills] = useState<{ value: string; label: string }[]>([]);

  // Fetch skills from the database
  useEffect(() => {
    async function loadSkills() {
      const fetchedSkills = await fetchSkills();
      setSkills(
        fetchedSkills.map((skill: { name: string; id: string }) => ({
          value: skill.id,
          label: skill.name,
        })),
      );
    }
    loadSkills();
  }, []);

  // Submit form mutation
  const mutation = useUpdateUserProfileMutation();

  // State for cropped avatar
  const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null);

  // SUBMIT FORM
  async function onSubmit(values: UpdateUserSchemaType) {
    // Check if there is a cropped avatar
    const newAvatarFile = croppedAvatar
      ? new File([croppedAvatar], `avatar_${user.id}.webp`)
      : undefined;
    console.log(values.skills);
    // Send data to server to update profile
    mutation.mutate(
      {
        values,
        avatarFile: newAvatarFile,
      },
      // On success close dialog and set avatar state null
      {
        onSuccess: () => {
          setCroppedAvatar(null);
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
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="mt-5 flex space-y-1.5">
          <Label>Avatar</Label>
          {/* AVATAR UPLOADER COMPONENT */}
          <AvatarUploader
            src={
              croppedAvatar
                ? URL.createObjectURL(croppedAvatar)
                : user.avatarUrl || avatarPlaceholder
            }
            onImageCropped={setCroppedAvatar}
          />
        </div>
        {/* FORM */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Displayname" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself"
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
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={skills.map((skill) => ({
                        value: skill.value,
                        label: skill.label,
                      }))}
                      value={field.value.map((skill) => ({
                        value: skill.id,
                        label: skill.name,
                      }))}
                      onChange={(selected) =>
                        field.onChange(
                          selected.map((skill) => ({
                            id: skill.value,
                            name: skill.label,
                          })),
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="yearOfGrad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year of Graduation</FormLabel>
                  <FormControl>
                    <Input placeholder="Year of Graduation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">
                {mutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

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
