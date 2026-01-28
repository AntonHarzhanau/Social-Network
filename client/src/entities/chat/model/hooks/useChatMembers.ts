import { useInfiniteQuery } from "@tanstack/react-query";
import { chatKeys } from "../queryKeys";
import { fetchChatMembers } from "../../api/chat";

const MEMBERS_PAGE_SIZE = 10;

export function useChatMembers(params: {
  chatId: string;
  search?: string;
  enabled?: boolean;
}) {
  const { chatId, search, enabled = true } = params;

  const query = useInfiniteQuery({
    queryKey: chatKeys.members(chatId, search),
    enabled: enabled && !!chatId,
    queryFn: ({ pageParam }) =>
      fetchChatMembers(
        chatId,
        (pageParam as number) ?? 1,
        MEMBERS_PAGE_SIZE,
        search,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < MEMBERS_PAGE_SIZE ? undefined : allPages.length + 1,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });

  const data = query.data?.pages.flatMap((p) => p) ?? [];
  return { ...query, data };
}
