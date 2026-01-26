import { useCallback, useEffect, useMemo, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import type { Message } from "@/entities/chat/model/types";
import { fetchMessages } from "@/entities/chat/api/chat";
import {
  useInfiniteMessages,
  MESSAGES_PAGE_SIZE,
} from "@/entities/chat/model/useChat";
import { messageKeys } from "@/entities/message/model/queryKeys";

import {
  addMessageToInfinite,
  prependTailPage,
  removeMessageFromInfinite,
  type MessagesInfinite,
} from "@/shared/lib/messagesCache";

import { useMercure } from "@/shared/hooks/useMercure";

type ChatMercureEvent =
  | { type: "message_created"; message: Message & { chatId: string } }
  | { type: "message_deleted"; messageId: string };

function toMs(iso: string) {
  return new Date(iso).getTime();
}

function normalizeAsc(page: Message[]): Message[] {
  if (page.length <= 1) return page;
  const a = toMs(page[0].createdAt);
  const b = toMs(page[page.length - 1].createdAt);
  if (a > b) return [...page].reverse();
  if (a < b) return page;
  return [...page].sort((x, y) => {
    const d = toMs(x.createdAt) - toMs(y.createdAt);
    if (d !== 0) return d;
    return x.id.localeCompare(y.id);
  });
}

export const useChatMessages = (
  chatId: string,
  initialAnchorId: string | null,
) => {
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteMessages(chatId, initialAnchorId);

  const tailEnsuredRef = useRef(false);

  useEffect(() => {
    if (!initialAnchorId) return;
    if (!data) return;
    if (tailEnsuredRef.current) return;

    tailEnsuredRef.current = true;

    fetchMessages(chatId, { limit: MESSAGES_PAGE_SIZE })
      .then((tail) => {
        queryClient.setQueryData<MessagesInfinite>(
          messageKeys.list(chatId),
          (old) => prependTailPage(old, normalizeAsc(tail)),
        );
      })
      .catch(console.error);
  }, [chatId, initialAnchorId, data, queryClient]);

  const handleMercureMessage = useCallback(
    (payload: ChatMercureEvent) => {
      if (payload.type === "message_created") {
        queryClient.setQueryData<MessagesInfinite>(
          messageKeys.list(chatId),
          (oldData) => addMessageToInfinite(oldData, payload.message),
        );
      }

      if (payload.type === "message_deleted") {
        queryClient.setQueryData<MessagesInfinite>(
          messageKeys.list(chatId),
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
    const pages = data?.pages ?? [];
    const flat = [...pages].reverse().flat();

    const seen = new Set<string>();
    const out: Message[] = [];
    for (const m of flat) {
      if (seen.has(m.id)) continue;
      seen.add(m.id);
      out.push(m);
    }
    return out;
  }, [data]);

  return {
    messages,
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
  };
};
