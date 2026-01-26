import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useChat } from "@/entities/chat/model/useChat";
import type { Chat } from "@/entities/chat/model/types";
import { useChatMessages } from "@/entities/chat/model/useChatMessages";

import { useChatRouting } from "@/features/chat/openedChats/lib/useChatRouting";
import { useOpenedChatsStore } from "@/features/chat/openedChats/model/openedChatsStore";
import { sessionStore } from "@/entities/session/model/sessionStore";

import {
  useAliveRef,
  useLatestMessageRefs,
  type Ref,
} from "./hooks/useChatRoomRefs";
import { useMessagesVirtualizer } from "./hooks/useMessagesVirtualizer";
import { useScrollPersistence } from "./hooks/useScrollPersistence";
import { useReadScheduler } from "./hooks/useReadScheduler";
import { useScrollEvents } from "./hooks/useScrollEvents";
import { useSyncLatest } from "./hooks/useSyncLatest";
import { useInitialRestore } from "./hooks/useInitialRestore";
import { useChatMercure } from "./hooks/useChatMercure";

export function useChatRoomController(params: {
  chatId: string;
  pageSize: number;
  readDebounceMs: number;
}) {
  const qc = useQueryClient();
  const { closeView } = useChatRouting();
  const currentUserId = sessionStore((s) => s.user?.id);

  const open = useOpenedChatsStore((s) => s.open);
  const setScroll = useOpenedChatsStore((s) => s.setScroll);

  const openStateRef = useRef<any>(
    useOpenedChatsStore.getState().byId[params.chatId],
  ) as unknown as Ref<any>;

  useEffect(() => {
    open(params.chatId);
    openStateRef.current = useOpenedChatsStore.getState().byId[params.chatId];
  }, [params.chatId, open, openStateRef]);

  const { data: chat, isLoading, isError, error } = useChat(params.chatId);
  const aliveRef = useAliveRef();

  const { query, messages, unreadSet, markReadUpTo } = useChatMessages({
    chat,
    pageSize: params.pageSize,
  });

  const { messagesRef, unreadRef, queryRef } = useLatestMessageRefs({
    messages,
    unreadSet,
    query,
  });

  const lastReadAtRef = useRef<string | null>(null) as unknown as Ref<
    string | null
  >;
  const lastReadMessageIdRef = useRef<string | null>(null) as unknown as Ref<
    string | null
  >;

  useEffect(() => {
    lastReadAtRef.current = (chat?.lastReadAt ?? null) as string | null;
    lastReadMessageIdRef.current = (chat?.lastReadMessageId ?? null) as
      | string
      | null;
  }, [
    chat?.lastReadAt,
    chat?.lastReadMessageId,
    lastReadAtRef,
    lastReadMessageIdRef,
  ]);

  const v = useMessagesVirtualizer({
    messagesLength: messages.length,
    messagesRef,
    unreadRef,
    currentUserId,
  });

  const s = useScrollPersistence({
    chatId: params.chatId,
    openStateRef,
    setScroll,
    computeBottomVisibleMessageId: v.computeBottomVisibleMessageId,
    recomputeTail: v.recomputeTail,
    aliveRef,
  });

  const [newCount, setNewCount] = useState(0);

  const { scheduleRead } = useReadScheduler({
    readDebounceMs: params.readDebounceMs,
    currentUserId,
    messagesRef,
    aliveRef,
    lastReadAtRef,
    lastReadMessageIdRef,
    markReadUpTo,
  });

  useSyncLatest({ chatId: chat?.id, pageSize: params.pageSize, qc, aliveRef });

  useInitialRestore({
    chatId: chat?.id,
    openStateRef,
    parentRef: v.parentRef,
    messagesRef,
    unreadRef,
    queryRef,
    aliveRef,
    rowVirtualizer: v.rowVirtualizer,
    scrollToBottom: v.scrollToBottom,
    recomputeTail: v.recomputeTail,
    setIsAtTail: s.setIsAtTail,
    setNewCount,
    scheduleSaveScroll: s.scheduleSaveScroll,
    scheduleRead,
    getBottomVisibleUnreadId: v.getBottomVisibleUnreadId,
    currentUserId,
  });

  useScrollEvents({
    parentRef: v.parentRef,
    rowVirtualizer: v.rowVirtualizer,
    messagesRef,
    queryRef,
    aliveRef,
    scheduleSaveScroll: s.scheduleSaveScroll,
    scheduleRead,
    getBottomVisibleUnreadId: v.getBottomVisibleUnreadId,
    recomputeTail: v.recomputeTail,
    newCount,
    resetNewCount: () => setNewCount(0),
  });

  useChatMercure({
    chatId: params.chatId,
    enable: !!params.chatId,
    currentUserId,
    recomputeTail: v.recomputeTail,
    scrollToBottom: v.scrollToBottom,
    scheduleSaveScroll: s.scheduleSaveScroll,
    scheduleRead,
    setIsAtTail: s.setIsAtTail,
    incNewCount: () => setNewCount((c) => c + 1),
  });

  const jumpToLatest = useCallback(() => {
    setNewCount(0);
    requestAnimationFrame(() => {
      v.scrollToBottom();
      s.scheduleSaveScroll();
      scheduleRead(v.getBottomVisibleUnreadId());
    });
  }, [v, s, scheduleRead]);

  const prepareForSend = useCallback(() => {
    setNewCount(0);
    s.setIsAtTail(true);
    setScroll(params.chatId, { isAtBottom: true });
    requestAnimationFrame(() => {
      v.scrollToBottom();
      s.scheduleSaveScroll();
    });
  }, [params.chatId, setScroll, v, s]);

  const title = useMemo(() => {
    if (!chat) return "Chat";
    if (chat.type === "self") return "Saved messages";
    return chat.title ?? "Chat";
  }, [chat]);

  return {
    chat: chat as Chat | undefined,
    title,
    currentUserId,

    isLoading,
    isError,
    errorMessage: (error as Error | undefined)?.message ?? "Unknown error",

    isFetching: query.isFetchingPreviousPage,

    parentRef: v.parentRef,
    totalSize: v.totalSize,
    virtualItems: v.virtualItems,
    measureElement: v.measureElement,

    messages,
    unreadSet,

    newCount,
    showNewBanner: !s.isAtTail && newCount > 0,
    showJumpArrow: !s.isAtTail,
    jumpToLatest,
    prepareForSend,
    closeView,
  };
}
