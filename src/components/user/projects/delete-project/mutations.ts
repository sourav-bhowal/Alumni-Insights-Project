import { useToast } from "@/components/ui/use-toast";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
// import { createUserProject } from "./actions";
import { UserProjectPage } from "@/utils/types";
import { useRouter } from "next/navigation";
// import { redis } from "@/lib/redis";
import { useSession } from "@/context/SessionProvider";
import { deleteUserProject } from "./actions";

// CREATE USER PROJECT MUTATION
export function useDeleteUserProjectMutation() {
  // TOAST
  const { toast } = useToast();

//   const { user } = useSession();

  // QUERY CLIENT
//   const queryClient = useQueryClient();

  const router = useRouter();

  // MUTATION
  const mutation = useMutation({
    // Create User Project
    mutationFn: deleteUserProject,
    // ON SUCCESS
    onSuccess: async (deletedUserProject) => {
      // refetch user projects
      router.refresh();
      // show toast
      toast({
        title: "Project deleted successfully",
        variant: "default",
      });
    },
    // ON ERROR
    onError: (error) => {
      // show toast
      toast({
        title: "Error deleting project",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // RETURN MUTATION
  return mutation;
}
