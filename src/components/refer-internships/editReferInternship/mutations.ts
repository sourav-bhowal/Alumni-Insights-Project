import { ReferInternshipPage } from "@/utils/types";
import { useToast } from "@/components/ui/use-toast";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { editReferInternship } from "./actions";
import { useSession } from "@/context/SessionProvider";

// EDIT REFER JOB MUTATION
export function useEditReferInternshipMutation() {
  // TOAST
  const { toast } = useToast();
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // SESSION
  const { user } = useSession();

  // Mutation
  const mutation = useMutation({
    // edit post
    mutationFn: editReferInternship,
    // On success do this
    onSuccess: async (editedReferInternship) => {
      // query key
      const queryKey = ["refer-internships"];
      // cancel queries
      await queryClient.cancelQueries({ queryKey });
      // set query data to update the UI
      queryClient.setQueryData<InfiniteData<ReferInternshipPage, string | null>>(
        queryKey,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              referInternships: page.referInternships.map((referInternship) =>   // if referJob.id is equal to editedReferJob.id then return editedReferJob else return referJob
                referInternship.id === editedReferInternship.id ? editedReferInternship : referInternship
              ),
            })),
          };
        }
      );
      // show toast
      toast({
        description: "Refer Internship updated.",
      });
    },
    // on error do this
    onError(error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: error.message,
      });
    },
  });

  // return mutation
  return mutation;
}