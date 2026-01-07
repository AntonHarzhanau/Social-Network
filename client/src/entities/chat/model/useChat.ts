import {
  fetchChats,
  fetchChatById,
  fetchMessages,
} from "@/entities/chat/api/chat";
import type { Chat, Message } from "@/entities/chat/model/types";


import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const CHATS_PAGE_SIZE = 15;
const MESSAGES_PAGE_SIZE = 20;

export const useInfiniteChats = () =>
  useInfiniteQuery<Chat[]>({
    queryKey: ["chats"],
    queryFn: ({ pageParam = 1 }) =>
      fetchChats(pageParam as number, CHATS_PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === CHATS_PAGE_SIZE ? allPages.length + 1 : undefined,
  });

export const useChatQuery = (chatId?: string) =>
  useQuery({
    queryKey: ["chat", chatId],
    queryFn: () => fetchChatById(chatId as string),
    enabled: !!chatId,
  });

export const useInfiniteMessages = (chatId?: string) =>
  useInfiniteQuery<Message[]>({
    queryKey: ["messages", chatId],
    enabled: !!chatId,

    initialPageParam: undefined as string | undefined,

    queryFn: ({ pageParam }) =>
      fetchMessages(chatId as string, {
        before: pageParam as string | undefined,
        limit: MESSAGES_PAGE_SIZE,
      }),

    getNextPageParam: (lastPage) => {
      if (lastPage.length < MESSAGES_PAGE_SIZE) {
        return undefined;
      }

      const oldestMessages = lastPage[lastPage.length - 1];
      return oldestMessages.createdAt;
    },

    // staleTime: 1000 * 60, // 1 minute
    // gcTime: 1000 * 60 * 5, // 5 minutes
    // refetchOnMount: false,
    // refetchOnWindowFocus: false,
  });
