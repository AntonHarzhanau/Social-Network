import type { UserPreview } from "@/entities/user/model/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchFriends, fetchFriendsRequest } from "../api/friends";
import { fetchUsers } from "@/entities/user/api/userApi";

export type FriendsFilter = "all" | "sent" | "received" | "";

export const usePeopleListInfinite = (
  filter: FriendsFilter,
  userId: string | undefined,
  limit = 10,
  search?: string,
) => {
  const q = search?.trim() || "";
  const query = useInfiniteQuery<UserPreview[]>({
    queryKey: ["people", { filter, userId, limit, q }] as const,
    initialPageParam: 1,
    enabled: filter === "all" ? Boolean(userId) : true,

    queryFn: ({ pageParam, signal }) => {
      const page = pageParam as number;

      if (filter === "all") {
        return fetchFriends(userId as string, page, limit);
      }

      if (filter === "sent" || filter === "received") {
        return fetchFriendsRequest(filter, page, limit);
      }

      return fetchUsers(page, limit, q, signal);
    },

    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) {
        return undefined;
      }
      return allPages.length + 1;
    },
  });
  const data = query.data?.pages.flatMap((page) => page) ?? [];
  return { ...query, data };
};
