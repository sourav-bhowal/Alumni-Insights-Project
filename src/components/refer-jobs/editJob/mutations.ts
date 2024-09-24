import { ReferJobPage } from "@/utils/types";
import { useToast } from "@/components/ui/use-toast";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { editReferJob } from "./actions";
import { useSession } from "@/context/SessionProvider";

// EDIT REFER JOB MUTATION
export function useEditReferJobMutation() {
  // TOAST
  const { toast } = useToast();
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // SESSION
  const { user } = useSession();

  // Mutation
  const mutation = useMutation({
    // edit post
    mutationFn: editReferJob,
    // On success do this
    onSuccess: async (editedReferJob) => {
      // query key
      const queryKey = ["refer-jobs"];
      // cancel queries
      await queryClient.cancelQueries({ queryKey });
      // set query data to update the UI
      queryClient.setQueryData<InfiniteData<ReferJobPage, string | null>>(
        queryKey,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              referJobs: page.referJobs.map((referJob) =>   // if referJob.id is equal to editedReferJob.id then return editedReferJob else return referJob
                referJob.id === editedReferJob.id ? editedReferJob : referJob
              ),
            })),
          };
        }
      );
      // show toast
      toast({
        description: "Refer Job updated.",
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