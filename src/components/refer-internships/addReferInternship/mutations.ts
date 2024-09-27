import { useToast } from "@/components/ui/use-toast";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createReferInternship } from "./actions";
import { ReferInternshipPage } from "@/utils/types";
import { useSession } from "@/context/SessionProvider";

// CREATE REFER JOB MUTATION
export function useCreateReferInternshipMutation() {
  // GET USER FROM SESSION
  const { user } = useSession();

  // QUERY CLIENT
  const queryClient = useQueryClient();

  // TOAST
  const { toast } = useToast();

  // MUTATION
  const mutation = useMutation({
    // Create Refer Job
    mutationFn: createReferInternship,
    // ON SUCCESS
    onSuccess: async (newReferInternship) => {
      // query key
      const queryKey = ["refer-internships"];
      // cancel refetch
      queryClient.cancelQueries({ queryKey });
      // set query manually
      queryClient.setQueryData<InfiniteData<ReferInternshipPage, string | null>>(
        queryKey,
        (oldData) => {
          const firstPage = oldData?.pages[0];
          if (firstPage) {
            return {
              pageParams: oldData?.pageParams,
              pages: [
                {
                  referInternships: [newReferInternship, ...firstPage.referInternships],
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
        title: "Internship Refered",
        description: "Internship has been refered successfully",
        variant: "default",
      });
    },
    // ON ERROR
    onError: () => {
      toast({
        title: "Error",
        description: "An error occurred while refering internship",
        variant: "destructive",
      });
    },
  });

  // return mutation
  return mutation;
}
