import { useToast } from "@/components/ui/use-toast";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createUserProject } from "./actions";
import { UserProjectPage } from "@/utils/types";
import { useRouter } from "next/navigation";
import { redis } from "@/lib/redis";
import { useSession } from "@/context/SessionProvider";

// CREATE USER PROJECT MUTATION
export function useCreateUserProjectMutation() {
  // TOAST
  const { toast } = useToast();

  const { user } = useSession();

  // QUERY CLIENT
  const queryClient = useQueryClient();

  const router = useRouter();

  // MUTATION
  const mutation = useMutation({
    // Create User Project
    mutationFn: createUserProject,
    // ON SUCCESS
    onSuccess: async (newUserProject) => {
      // filter the posts as per query key
      // const queryFilter: QueryFilters = {
      //   queryKey: ["user-projects"],
      //   predicate(query) {
      //     return query.queryKey[0] === "user-projects";
      //   },
      // };
      // // cancel refetch
      // queryClient.cancelQueries(queryFilter);
      // // set query manually
      // queryClient.setQueriesData<InfiniteData<UserProjectPage, string | null>>(
      //   queryFilter,
      //   (oldData) => {
      //     const firstPage = oldData?.pages[0];
      //     if (firstPage) {
      //       return {
      //         pageParams: oldData?.pageParams,
      //         pages: [
      //           {
      //             projects: [newUserProject, ...firstPage.projects],
      //             nextCursor: firstPage.nextCursor,
      //           },
      //           ...oldData.pages.slice(1),
      //         ],
      //       };
      //     }
      //   },
      // );
      // // invalidate query
      // queryClient.invalidateQueries({
      //   queryKey: queryFilter.queryKey,
      //   predicate(query) {
      //     return query.queryKey[0] === "all-projects";
      //   },
      // });
      
      router.refresh();
      // show toast
      toast({
        title: "Project created successfully",
        variant: "default",
      });
    },
    // ON ERROR
    onError: (error) => {
      // show toast
      toast({
        title: "Error creating project",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // RETURN MUTATION
  return mutation;
}
