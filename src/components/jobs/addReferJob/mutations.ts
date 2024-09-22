import { useToast } from "@/components/ui/use-toast";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createReferJob } from "./actions";
import { ReferJobPage } from "@/utils/types";
import { useSession } from "@/context/SessionProvider";

// CREATE REFER JOB MUTATION
export function useCreateReferJobMutation() {
  // GET USER FROM SESSION
  const { user } = useSession();

  // QUERY CLIENT
  const queryClient = useQueryClient();

  // TOAST
  const { toast } = useToast();

  // MUTATION
  const mutation = useMutation({
    // Create Refer Job
    mutationFn: createReferJob,
    // ON SUCCESS
    onSuccess: async (newReferJob) => {
      // query key
      const queryKey = ["refer-jobs"];
      // cancel refetch
      queryClient.cancelQueries({ queryKey });
      // set query manually
      queryClient.setQueryData<InfiniteData<ReferJobPage, string | null>>(
        queryKey,
        (oldData) => {
          const firstPage = oldData?.pages[0];
          if (firstPage) {
            return {
              pageParams: oldData?.pageParams,
              pages: [
                {
                  referJobs: [newReferJob, ...firstPage.referJobs],
                  nextCursor: firstPage.nextCursor,
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
      );
      // invalidate query
      queryClient.invalidateQueries({
        queryKey,
        predicate(query) {
          return !query.state.data;
        },
      });
      // show toast
      toast({
        title: "Job Refered",
        description: "Job has been refered successfully",
        variant: "default",
      });
    },
    // ON ERROR
    onError: () => {
      toast({
        title: "Error",
        description: "An error occurred while refering job",
        variant: "destructive",
      });
    },
  });

  // return mutation
  return mutation;
}
