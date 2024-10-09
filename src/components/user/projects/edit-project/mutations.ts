import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@/context/SessionProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { editUserProject } from "./actions";

// EDIT USER PROJECT MUTATION
export function useEditUserProjectMutation() {
  // TOAST
  const { toast } = useToast();
  // USER SESSION
  const { user } = useSession();
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // ROUTER
  const router = useRouter();

  // MUTATION
  const mutation = useMutation({
    // Edit User Project
    mutationFn: editUserProject,
    // ON SUCCESS
    onSuccess: async (editedUserProject) => {
      // show toast
      toast({
        title: "Project Updated",
        variant: "default",
      });
      // refresh
      router.refresh();
    },
    // ON ERROR
    onError: (error) => {
      // show toast
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return mutation;
}
