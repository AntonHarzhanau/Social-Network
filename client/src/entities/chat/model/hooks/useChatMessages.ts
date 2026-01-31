import { useCallback, useMemo, useRef } from "react";
import {
  useInfiniteQuery,
  type InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import type { Chat, Message } from "@/entities/chat/model/types";
import { fetchMessages, markMessagesAsRead } from "@/entities/chat/api/chat";
import { chatQueryKeys } from "@/entities/chat/model/chatQueryKeys";
import { chatMessageKeys } from "@/entities/chat/model/messageQueryKeys";

export type PageParam =
  | { kind: "initial" }
  | { kind: "before"; messageId: string };

export type MarkReadResponse = {
  lastReadMessageId: string;
  lastReadAt: string;
  chatId: string;
};

type MsgInf = InfiniteData<Message[], PageParam>;
type MessagesKey = ReturnType<typeof chatMessageKeys.byChat>;

function invalidateChatLists(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({
    predicate: (q) =>
      Array.isArray(q.queryKey) &&
      q.queryKey[0] === chatQueryKeys.all[0] &&
      q.queryKey[1] === "list",
  });
}

function getOldestId(page: Message[]) {
  if (!page.length) return undefined;
  let best = page[0];
  for (let i = 1; i < page.length; i++) {
    const m = page[i];
    if (new Date(m.createdAt).getTime() < new Date(best.createdAt).getTime()) {
      best = m;
    }
  }
  return best.id;
}

function sortAscStable(arr: Message[]) {
  return arr.slice().sort((a, b) => {
    const ta = new Date(a.createdAt).getTime();
    const tb = new Date(b.createdAt).getTime();
    if (ta !== tb) return ta - tb;
    return a.id.localeCompare(b.id);
  });
}

export function useChatMessages(params: {
  chat: Chat | undefined;
  pageSize: number;
  currentUserId?: string;
}) {
  const { chat, pageSize, currentUserId } = params;
  const qc = useQueryClient();

  const queuedReadIdRef = useRef<string | null>(null);
  const lastSentReadIdRef = useRef<string | null>(null);

  const markReadMutation = useMutation({
    mutationFn: (payload: { chatId: string; lastReadMessageId: string }) =>
      markMessagesAsRead(
        payload.chatId,
        payload.lastReadMessageId,
      ) as Promise<MarkReadResponse>,

    onSuccess: (res) => {
      qc.setQueryData<Chat>(chatQueryKeys.byId(res.chatId), (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          lastReadMessageId: res.lastReadMessageId,
          lastReadAt: res.lastReadAt,
          unreadMessageCount: 0,
        };
      });

      invalidateChatLists(qc);
      lastSentReadIdRef.current = res.lastReadMessageId;
    },

    onSettled: () => {
      if (!chat?.id) return;
      const nextId = queuedReadIdRef.current;
      if (!nextId) return;

      if (nextId === lastSentReadIdRef.current) {
        queuedReadIdRef.current = null;
        return;
      }

      queuedReadIdRef.current = null;
      markReadMutation.mutate({ chatId: chat.id, lastReadMessageId: nextId });
    },
  });

  const markReadUpTo = useCallback(
    (messageId: string) => {
      if (!chat?.id) return;
      if (messageId === lastSentReadIdRef.current) return;

      queuedReadIdRef.current = messageId;

      if (!markReadMutation.isPending) {
        const next = queuedReadIdRef.current;
        if (!next) return;

        if (next === lastSentReadIdRef.current) {
          queuedReadIdRef.current = null;
          return;
        }

        queuedReadIdRef.current = null;
        markReadMutation.mutate({ chatId: chat.id, lastReadMessageId: next });
      }
    },
    [chat?.id, markReadMutation],
  );

  const query = useInfiniteQuery<
    Message[],
    Error,
    MsgInf,
    MessagesKey,
    PageParam
  >({
    enabled: !!chat?.id,
    queryKey: chatMessageKeys.byChat(chat?.id ?? "__disabled__"),
    initialPageParam: { kind: "initial" },
    staleTime: Infinity,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    placeholderData: (prev) => prev,

    queryFn: async ({ pageParam }) => {
      if (!chat) return [];

      if (pageParam.kind === "initial") {
        return fetchMessages(chat.id, { limit: pageSize });
      }

      return fetchMessages(chat.id, {
        mode: "before",
        messageId: pageParam.messageId,
        limit: pageSize,
      });
    },

    getPreviousPageParam: (firstPage) => {
      if (!firstPage?.length) return undefined;
      if (firstPage.length < pageSize) return undefined;

      const oldestId = getOldestId(firstPage);
      if (!oldestId) return undefined;

      return { kind: "before", messageId: oldestId };
    },

    getNextPageParam: () => undefined,
  });

  const messages = useMemo(() => {
    const pages = query.data?.pages ?? [];
    const byId = new Map<string, Message>();

    for (const p of pages) {
      for (const m of p) byId.set(m.id, m);
    }

    return sortAscStable(Array.from(byId.values()));
  }, [query.data?.pages]);

  const unreadSet = useMemo(() => {
    if (!chat) return new Set<string>();
    if (!currentUserId) return new Set<string>();

    let thresholdMs: number | null = null;

    if (chat.lastReadAt) {
      const t = Date.parse(chat.lastReadAt);
      if (Number.isFinite(t)) thresholdMs = t;
    } else if (chat.lastReadMessageId) {
      const anchor = messages.find((m) => m.id === chat.lastReadMessageId);
      const t = anchor ? Date.parse(anchor.createdAt) : NaN;
      if (Number.isFinite(t)) thresholdMs = t;
    }

    const s = new Set<string>();

    for (const m of messages) {
      if (m.sender.id === currentUserId) continue;

      if (thresholdMs === null) {
        s.add(m.id);
        continue;
      }

      const mt = Date.parse(m.createdAt);
      if (Number.isFinite(mt) && mt > thresholdMs) s.add(m.id);
    }

    return s;
  }, [chat?.lastReadAt, chat?.lastReadMessageId, messages, currentUserId]);

  return { query, messages, unreadSet, markReadUpTo };
}
