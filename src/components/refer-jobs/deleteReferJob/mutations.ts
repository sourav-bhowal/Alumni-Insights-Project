import { ReferJobPage } from "@/utils/types";
import { useToast } from "@/components/ui/use-toast";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { deleteReferJob } from "./actions";

// DELETE REFER JOB MUTATION
export function useDeleteReferJobMutation() {
  // TOAST
  const { toast } = useToast();
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // ROUTER
  // const router = useRouter();
  // // PATHNAME
  // const pathName = usePathname();

  // Mutation
  const mutation = useMutation({
    // delete post
    mutationFn: deleteReferJob,
    // On success do this
    onSuccess: async (deletedReferJob) => {
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
              referJobs: page.referJobs.filter((referJob) => referJob.id !== deletedReferJob.id),
            })),
          };
        },
      );
      // show toast
      toast({
        description: "Refer Job deleted.",
      });

      // if (pathName === `/posts/${deletedReferJob.id}`) {
      //   router.push("/services/jobs");
      // }
    },
    // on error do this
    onError(error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: "Failed to delete refered job. Try again",
      });
    },
  });

  // return mutation
  return mutation;
}
