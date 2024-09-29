import { useToast } from "@/components/ui/use-toast";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { EventPage } from "@/utils/types";
import { createEvent } from "./actions";

// CREATE EVENT MUTATION
export function useCreateEventMutation() {
  // TOAST
  const { toast } = useToast();

  // QUERY CLIENT
  const queryClient = useQueryClient();

  // MUTATION
  const mutation = useMutation({
    // Create Event
    mutationFn: createEvent,
    // ON SUCCESS
    onSuccess: async (newEvent) => {
      // filter the posts as per query key
      const queryFilter = {
        queryKey: ["all-events"],
        predicate(query) {
          return (
            query.queryKey.includes("all-events") ||
            query.queryKey.includes("webinars") ||
            query.queryKey.includes("workshops") ||
            query.queryKey.includes("reunions") ||
            query.queryKey.includes("conferences") ||
            query.queryKey.includes("seminars")
          );
        },
      } satisfies QueryFilters;
      // cancel refetch
      queryClient.cancelQueries(queryFilter);
      // set query manually
      queryClient.setQueriesData<InfiniteData<EventPage, string | null>>(
        queryFilter,
        (oldData) => {
          const firstPage = oldData?.pages[0];
          if (firstPage) {
            return {
              pageParams: oldData?.pageParams,
              pages: [
                {
                  events: [newEvent, ...firstPage.events],
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
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return queryFilter.predicate(query) && !query.state.data;
        },
      });
      // show toast
      toast({
        title: "Event created successfully",
        variant: "default",
      });
    },
    // ON ERROR
    onError: (error) => {
      // show toast
      toast({
        title: "Error creating event",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // RETURN
  return mutation;
}
