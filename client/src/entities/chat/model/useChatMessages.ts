import { useQueryClient } from "@tanstack/react-query";
import type { Message } from "@/entities/chat/model/types";
import { useInfiniteMessages } from "@/entities/chat/model/useChat";
import { useCallback, useMemo } from "react";
import {
  addMessageToInfinite,
  removeMessageFromInfinite,
  type MessagesInfinite,
} from "@/shared/lib/messagesCache";
import { useMercure } from "@/shared/hooks/useMercure";

type ChatMercureEvent =
  | { type: "message_created"; message: Message & { chatId: string } }
  | { type: "message_deleted"; messageId: string };

export const useChatMessages = (chatId: string) => {
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteMessages(chatId);

  const handleMercureMessage = useCallback(
    (payload: ChatMercureEvent) => {
      if (payload.type === "message_created") {
        queryClient.setQueryData<MessagesInfinite>(
          ["messages", chatId],
          (oldData) => addMessageToInfinite(oldData, payload.message),
        );
      }

      if (payload.type === "message_deleted") {
        queryClient.setQueryData<MessagesInfinite>(
          ["messages", chatId],
          (oldData) => removeMessageFromInfinite(oldData, payload.messageId),
        );
      }
    },
    [chatId, queryClient],
  );

  useMercure<ChatMercureEvent>({
    topic: `https://social-network.local/chats/${chatId}`,
    onMessage: handleMercureMessage,
    enable: !!chatId,
  });

  const messages = useMemo(() => {
    const flat = data?.pages.flat() ?? [];

    return [...flat].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      if (dateA !== dateB) return dateA - dateB;
      return a.id.localeCompare(b.id);
    });
  }, [data]);

  return {
    messages,
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
  };
};
