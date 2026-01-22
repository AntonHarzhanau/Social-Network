import type { UserPreview } from "@/entities/user/model/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { friendsQueryKeys } from "./queryKeys";
import { fetchFriends, fetchFriendsRequest } from "../api/friends";

export type FriendsFilter = "all" | "sent" | "received";

export function useFriends(
  filter: FriendsFilter,
  userId: string | undefined,
  limit: number,
  search: string,
) {
  const q = search.trim() || "";

  const query = useInfiniteQuery<UserPreview[]>({
    queryKey:
      filter === "all"
        ? friendsQueryKeys.list(userId ?? "me", { query: q, limit })
        : friendsQueryKeys.requests(filter, { query: q, limit }),

    enabled: filter === "all" ? !!userId : true,
    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      const page = pageParam as number;

      if (filter === "all") {
        return fetchFriends(userId, page, limit, q);
      }

      return fetchFriendsRequest(filter, page, limit, q);
    },

    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length < limit ? undefined : allPages.length + 1;
    },
  });

  const data = query.data?.pages.flatMap((page) => page) ?? [];
  return { ...query, data };
}
