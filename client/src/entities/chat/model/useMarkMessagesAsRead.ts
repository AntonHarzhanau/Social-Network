import { useCallback, useEffect, useRef } from "react";
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

import { markMessagesAsRead } from "@/entities/chat/api/chat";
import type { Chat, Message } from "@/entities/chat/model/types";
import { chatKeys, type ChatsFilter } from "@/entities/chat/model/queryKeys";

type ChatsInfinite = InfiniteData<Chat[], number>;

function updateChatReadState(
  chat: Chat,
  nextLastReadMessageId: string,
  nextUnreadCount?: number | null,
): Chat {
  const nowIso = new Date().toISOString();
  return {
    ...chat,
    lastReadMessageId: nextLastReadMessageId,
    lastReadAt: nowIso,
    unreadMessageCount:
      typeof nextUnreadCount === "number"
        ? nextUnreadCount
        : chat.unreadMessageCount,
  };
}

function updateChatInChatsInfinite(
  old: ChatsInfinite | undefined,
  chatId: string,
  nextLastReadMessageId: string,
  nextUnreadCount?: number | null,
): ChatsInfinite | undefined {
  if (!old) return old;
  return {
    ...old,
    pages: old.pages.map((page) =>
      page.map((c) =>
        c.id === chatId
          ? updateChatReadState(c, nextLastReadMessageId, nextUnreadCount)
          : c,
      ),
    ),
  };
}

export function useMarkMessagesAsRead(args: {
  chatId: string;
  messages: Message[];
  currentUserId?: string;
  chatsFilter?: ChatsFilter; // если есть вкладка unread/all — обновляй правильный список
}) {
  const { chatId, messages, currentUserId, chatsFilter = "all" } = args;
  const queryClient = useQueryClient();

  const timerRef = useRef<number | null>(null);
  const pendingIdRef = useRef<string | null>(null);
  const lastSentIdRef = useRef<string | null>(null);

  const computeUnreadCountAfter = useCallback(
    (newLastReadMessageId: string): number | null => {
      if (!currentUserId) return null;
      const idx = messages.findIndex((m) => m.id === newLastReadMessageId);
      if (idx < 0) return null;

      let cnt = 0;
      for (let i = idx + 1; i < messages.length; i++) {
        const m = messages[i];
        if (m.sender.id !== currentUserId) cnt++;
      }
      return cnt;
    },
    [messages, currentUserId],
  );

  const mutation = useMutation({
    mutationFn: async (vars: { lastReadMessageId: string }) => {
      await markMessagesAsRead(chatId, vars.lastReadMessageId);
    },

    onMutate: async ({ lastReadMessageId }) => {
      await queryClient.cancelQueries({ queryKey: chatKeys.detail(chatId) });
      await queryClient.cancelQueries({ queryKey: chatKeys.list(chatsFilter) });

      const prevChat = queryClient.getQueryData<Chat>(chatKeys.detail(chatId));
      const prevChats = queryClient.getQueryData<ChatsInfinite>(
        chatKeys.list(chatsFilter),
      );

      const nextUnread = computeUnreadCountAfter(lastReadMessageId);

      if (prevChat) {
        queryClient.setQueryData<Chat>(
          chatKeys.detail(chatId),
          updateChatReadState(prevChat, lastReadMessageId, nextUnread),
        );
      }

      queryClient.setQueryData<ChatsInfinite>(
        chatKeys.list(chatsFilter),
        (old) =>
          updateChatInChatsInfinite(old, chatId, lastReadMessageId, nextUnread),
      );

      return { prevChat, prevChats };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prevChat)
        queryClient.setQueryData(chatKeys.detail(chatId), ctx.prevChat);
      if (ctx?.prevChats)
        queryClient.setQueryData(chatKeys.list(chatsFilter), ctx.prevChats);
    },
  });

  const flush = useCallback(() => {
    timerRef.current = null;
    const id = pendingIdRef.current;
    pendingIdRef.current = null;

    if (!id) return;
    if (id === lastSentIdRef.current) return;

    lastSentIdRef.current = id;
    mutation.mutate({ lastReadMessageId: id });
  }, [mutation]);

  const markReadUpTo = useCallback(
    (messageId: string) => {
      pendingIdRef.current = messageId;
      if (timerRef.current != null) return;
      timerRef.current = window.setTimeout(flush, 350);
    },
    [flush],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current != null) window.clearTimeout(timerRef.current);
    };
  }, []);

  return { markReadUpTo, isPending: mutation.isPending };
}
