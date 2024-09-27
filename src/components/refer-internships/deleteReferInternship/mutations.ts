import { ReferInternshipPage } from "@/utils/types";
import { useToast } from "@/components/ui/use-toast";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { deleteReferInternship } from "./actions";

// DELETE REFER JOB MUTATION
export function useDeleteReferInternshipMutation() {
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
    mutationFn: deleteReferInternship,
    // On success do this
    onSuccess: async (deletedReferInternship) => {
      // query key
      const queryKey = ["refer-internships"];
      // cancel queries
      await queryClient.cancelQueries({ queryKey });
      // set query data to update the UI
      queryClient.setQueryData<
        InfiniteData<ReferInternshipPage, string | null>
      >(queryKey, (oldData) => {
        if (!oldData) return;

        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map((page) => ({
            nextCursor: page.nextCursor,
            referInternships: page.referInternships.filter(
              (referInternship) =>
                referInternship.id !== deletedReferInternship.id,
            ),
          })),
        };
      });
      // show toast
      toast({
        description: "Refer Internship deleted.",
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
        description: "Failed to delete refered internship. Try again",
      });
    },
  });

  // return mutation
  return mutation;
}
