import { useQuery } from "@tanstack/react-query";
import { friendsQueryKeys } from "./queryKeys";
import { fetchFriendsStats } from "../api/friends";

export function useFriendsStats(userId?: string) {
  return useQuery({
    queryKey: userId
      ? friendsQueryKeys.stats(userId)
      : ["friends", "stats", "disabled"],

    queryFn: () => fetchFriendsStats(userId as string),
    enabled: Boolean(userId),
    staleTime: 60 * 1000, // 1 minute
  });
}
