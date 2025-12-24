import { useCallback, useEffect } from "react";
import type { MessageResponse } from "../api/chat";
import { useChatStore } from "../store/chatStore";
import { useInfiniteMessages } from "./useChat";
import { useMercure } from "./useMercure";

interface ChatMercureEvent {
  type: string;
  message: MessageResponse;
}

export const useChatMessages = (chatId: string) => {
  const liveMessages = useChatStore((s) => s.liveMessages[chatId]) ?? [];
  const addLiveMessage = useChatStore((s) => s.addMessage);
  const clearLiveMessages = useChatStore((s) => s.clearLiveMessages);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteMessages(chatId);

  const historyMessages =
    data?.pages
      .flat()
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ) ?? [];

  const handleMercureMessage = useCallback(
    (payload: ChatMercureEvent) => {
      if (payload.type !== "message_created") return;
        console.log("New message received via Mercure:", payload);
      const newMsg = payload.message;
      addLiveMessage(chatId, newMsg);
    },
    [chatId, addLiveMessage],
  );

  useEffect(() => {
    clearLiveMessages(chatId);
  }, [chatId, clearLiveMessages]);

  useMercure<ChatMercureEvent>({
    topic: `https://qynso.local/chats/${chatId}`,
    onMessage: handleMercureMessage,
    enable: !!chatId,
  });

  const messages = [...historyMessages, ...liveMessages]
    .filter(
      (msg, index, arr) => arr.findIndex((m) => m.id === msg.id) === index,
    )
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    return { 
        messages,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    }
};
