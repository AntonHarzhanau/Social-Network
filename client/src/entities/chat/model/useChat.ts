import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { Chat, Message } from "@/entities/chat/model/types";
import {
  fetchChatById,
  fetchChats,
  fetchMessages,
} from "@/entities/chat/api/chat";
import { chatKeys, type ChatsFilter } from "@/entities/chat/model/queryKeys";
import { messageKeys } from "@/entities/message/model/queryKeys";

export const CHATS_PAGE_SIZE = 15;
export const MESSAGES_PAGE_SIZE = 20;

function toMs(iso: string) {
  return new Date(iso).getTime();
}

function normalizePageAsc(page: Message[]): Message[] {
  if (page.length <= 1) return page;

  const first = page[0];
  const last = page[page.length - 1];
  const a = toMs(first.createdAt);
  const b = toMs(last.createdAt);

  if (a > b) return [...page].reverse();
  if (a < b) return page;

  return [...page].sort((x, y) => {
    const dx = toMs(x.createdAt) - toMs(y.createdAt);
    if (dx !== 0) return dx;
    return x.id.localeCompare(y.id);
  });
}

/**
 * Chats list (infinite).
 * Если у тебя появится фильтр all/unread — просто прокинь filter.
 */
export const useInfiniteChats = (filter: ChatsFilter = "all") =>
  useInfiniteQuery<
    Chat[],
    Error,
    Chat[],
    ReturnType<typeof chatKeys.list>,
    number
  >({
    queryKey: chatKeys.list(filter),
    queryFn: ({ pageParam }) => fetchChats(pageParam, CHATS_PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === CHATS_PAGE_SIZE ? allPages.length + 1 : undefined,
  });

export const useChatQuery = (chatId?: string) =>
  useQuery<Chat, Error>({
    queryKey: chatId ? chatKeys.detail(chatId) : chatKeys.details(),
    queryFn: () => fetchChatById(chatId as string),
    enabled: !!chatId,
  });

export const useInfiniteMessages = (
  chatId: string,
  initialAnchorId: string | null,
) =>
  useInfiniteQuery<
    Message[],
    Error,
    Message[],
    ReturnType<typeof messageKeys.list>,
    string | null
  >({
    queryKey: messageKeys.list(chatId),
    enabled: !!chatId,

    initialPageParam: initialAnchorId ?? null,

    queryFn: async ({ pageParam }) => {
      if (pageParam === null) {
        const page = await fetchMessages(chatId, { limit: MESSAGES_PAGE_SIZE });
        return normalizePageAsc(page);
      }

      if (initialAnchorId && pageParam === initialAnchorId) {
        const page = await fetchMessages(chatId, {
          mode: "around",
          messageId: pageParam,
          limit: MESSAGES_PAGE_SIZE,
        });
        return normalizePageAsc(page);
      }

      const page = await fetchMessages(chatId, {
        mode: "before",
        messageId: pageParam,
        limit: MESSAGES_PAGE_SIZE,
      });
      return normalizePageAsc(page);
    },

    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length < MESSAGES_PAGE_SIZE) return undefined;
      return lastPage[0]?.id;
    },
  });
