import { useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { UpdateUserProfileSchemaType } from "@/lib/validations";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "./actions";
// import { PostsPage } from "@/utils/types";

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
      values: UpdateUserProfileSchemaType;
      avatarFile?: File;
    }) => {
      // update user info and avatar at same time so we use Promise.all
      return Promise.all([
        updateUserProfile(values),
        avatarFile && startAvatarUpload([avatarFile]), // upload avatar if it exists, send it in array
      ]);
    },
    onSuccess: async () => {
      // router refresh to update profile for server components
      router.refresh();

      // toast
      toast({
        title: "Profile updated",
        description: "Your profile has been updated.",
      });
    },
    onError: (error) => {
      console.log(error);
      // toast
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  return mutation;
}
