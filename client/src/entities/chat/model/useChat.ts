import { useQuery } from "@tanstack/react-query";
import { chatKeys } from "./queryKeys";
import { fetchChatById } from "../api/chat";

export function useChat(chatId: string) {
  const query = useQuery({
    queryKey: chatKeys.byId(chatId),
    queryFn: () => fetchChatById(chatId),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
  return query;
}
