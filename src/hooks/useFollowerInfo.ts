import { kyInstance } from "@/utils/ky";
import { FollowerInfo } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";

// FOLLOW INFO Fn
export default function useFollowerInfo(
  userId: string,
  initialState: FollowerInfo,
) {
  // QUERY
  const query = useQuery({
    queryKey: ["follower-info", userId],
    queryFn: () =>
      kyInstance.get(`/api/users/${userId}/followers`).json<FollowerInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  return query;
}
