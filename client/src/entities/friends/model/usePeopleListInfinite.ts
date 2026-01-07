import type { UserPreview } from "@/entities/user/model/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchFriends, fetchFriendsRequest } from "../api/friends";
import { fetchUsers } from "@/entities/user/api/userApi";

export type FriendsFilter = "all" | "sent" | "received" | "";

export const usePeopleListInfinite = (filter: FriendsFilter, userId: string | undefined, limit = 10) => {
  return useInfiniteQuery<UserPreview[]>({
    queryKey: ["people", {filter, userId, limit}] as const, 
    initialPageParam: 1,
    enabled: filter === "all" ? Boolean(userId) : true,

    queryFn: ({ pageParam }) => {
        const page = pageParam as number;

        if (filter === "all") {
            return fetchFriends(userId as string, page, limit);
        }

        if (filter === "sent" || filter === "received") {
            return fetchFriendsRequest(filter, page, limit);
        }

        return fetchUsers(page, limit);
    },

    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) {
        return undefined;
      }
      return allPages.length + 1;
    },

    select: (data) => ({
        ...data,
        pages: data.pages,
    })
  });
};

