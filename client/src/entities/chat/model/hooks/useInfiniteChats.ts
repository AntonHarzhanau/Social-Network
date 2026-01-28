import { useInfiniteQuery } from "@tanstack/react-query";
import { CHAT_PAGE_SIZE, fetchChats} from "../../api/chat";
import { chatKeys } from "../queryKeys";
import type { ChatFilter } from "../types";

export function useInfiniteChats(filter: ChatFilter, limit = CHAT_PAGE_SIZE) {
  return useInfiniteQuery({
    queryKey: chatKeys.list(filter, limit),
    queryFn: ({ pageParam }) =>
      fetchChats((pageParam as number) ?? 1, limit, filter),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) return undefined;
      return allPages.length + 1;
    },

    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
}
