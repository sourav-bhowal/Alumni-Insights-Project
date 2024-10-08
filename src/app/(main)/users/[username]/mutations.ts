import { useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { UpdateUserSchemaType } from "@/lib/validations";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "./actions";

// UPDATE USER PROFILE MUTATION
export function useUpdateUserProfileMutation() {
  // toast
  const { toast } = useToast();
  // router
  const router = useRouter();
  // query client
  const queryClient = useQueryClient();

  // uploadthing to upload avatar
  const { startUpload: startAvatarUpload } = useUploadThing("avatar");

  // update user profile mutation
  const mutation = useMutation({
    mutationFn: async ({
      values,
      avatarFile,
    }: {
      values: UpdateUserSchemaType;
      avatarFile?: File;
    }) => {
      // update user info and avatar at same time so we use Promise.all
      return Promise.all([
        updateUserProfile(values),
        avatarFile && startAvatarUpload([avatarFile]), // upload avatar if it exists, send it in array
      ]);
    },
    // ON SUCCESS
    onSuccess: () => {
      router.refresh();
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    },
    // ON ERROR
    onError: () => {
      toast({
        title: "Error",
        description: "An error occurred while updating your profile",
        variant: "destructive",
      });
    },
  });

  return mutation;
}
