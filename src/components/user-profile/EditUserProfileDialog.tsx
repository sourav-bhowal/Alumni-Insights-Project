import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserData } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { updateUserProfile } from "./actions";
import {
  updateUserProfileSchema,
  UpdateUserProfileSchemaType,
} from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import { useUpdateUserProfileMutation } from "./mutations";
import MultiSelect from "./MultiSelect";
import { AvatarUploader } from "./AvatarUploader";


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
  const form = useForm<UpdateUserProfileSchemaType>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      username: user.username,
      displayName: user.displayName,
      location: user.location || "",
      bio: user.bio || "",
      yearOfGrad: user.yearOfGrad || new Date().getFullYear(),
      skills: user.skills.map((skill) => skill.name) || [],
    },
  });

  // Submit form mutation
  const mutation = useUpdateUserProfileMutation();

  // State for cropped avatar
  const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null);

  const [selectedSkills, setSelectedSkills] = useState(user.skills || []);

  const handleDeleteSkill = (skillId: any) => {
    setSelectedSkills(selectedSkills.filter((skill) => skill.id !== skillId));
  };

  const handleSelectSkills = (selected: any) => {
    setSelectedSkills(selected);
  };

  // SUBMIT FORM
  async function onSubmit(values: UpdateUserProfileSchemaType) {
    // Check if there is a cropped avatar
    const newAvatarFile = croppedAvatar
      ? new File([croppedAvatar], `avatar_${user.id}.webp`)
      : undefined;

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
                  <FormLabel>DisplayName</FormLabel>
                  <FormControl>
                    <Input placeholder="DisplayName" {...field} />
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
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Location" {...field} />
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
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Current skills with delete icons */}
            <div>
              <FormLabel>Current Skills</FormLabel>
              <ul>
                {selectedSkills.map((skill) => (
                  <li key={skill.id} className="flex items-center">
                    <span>{skill.name}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteSkill(skill.id)}
                    >
                      <XIcon className="h-5 w-5 text-red-500" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {/* Multi-select dropdown for skills */}
            <div>
              <FormLabel>Select Skills</FormLabel>
              {/* <MultiSelect
                options={skillsOptions}
                value={selectedSkills}
                onChange={handleSelectSkills}
                labelledBy="Select"
              /> */}
            </div>
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
