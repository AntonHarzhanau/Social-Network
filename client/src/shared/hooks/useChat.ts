import {
  useInfiniteQuery,
  useQuery,
  type InfiniteData,
} from "@tanstack/react-query";
import {
  fetchChats,
  fetchChatById,
  fetchMessages,
  type ChatResponse,
  type MessageResponse,
} from "@/shared/api/chat";

const CHATS_PAGE_SIZE = 20;
const MESSAGES_PAGE_SIZE = 10;

export const useInfiniteChats = () =>
  useInfiniteQuery<ChatResponse[]>({
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
  useInfiniteQuery<MessageResponse[]>({
    queryKey: ["messages", chatId],
    queryFn: ({ pageParam = 1 }) =>
      fetchMessages(chatId as string, pageParam as number, MESSAGES_PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === MESSAGES_PAGE_SIZE ? allPages.length + 1 : undefined,
    enabled: !!chatId,
  });

export type MessagesInfiniteData = InfiniteData<MessageResponse[]>;
