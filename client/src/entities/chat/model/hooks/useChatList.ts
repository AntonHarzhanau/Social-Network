import { useMemo } from "react";
import type { ChatFilter } from "../types";
import type { Chat } from "../types";
import { useInfiniteChats } from "./useInfiniteChats";

export function useChatList(filter: ChatFilter) {
  const query = useInfiniteChats(filter);

  const chats: Chat[] = useMemo(
    () => query.data?.pages.flat() ?? [],
    [query.data],
  );
  return { ...query, chats };
}
