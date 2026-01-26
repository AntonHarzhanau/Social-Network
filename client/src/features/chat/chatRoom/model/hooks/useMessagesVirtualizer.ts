import { useCallback, useRef } from "react";
import { useVirtualizer, type VirtualItem } from "@tanstack/react-virtual";
import type { Message } from "@/entities/chat/model/types";
import type { Ref } from "./useChatRoomRefs";

export function useMessagesVirtualizer(params: {
  messagesLength: number;
  messagesRef: Ref<Message[]>;
  unreadRef: Ref<Set<string>>;
  currentUserId?: string;
}) {
  const parentRef = useRef<HTMLDivElement | null>(
    null,
  ) as unknown as Ref<HTMLDivElement | null>;

  const rowVirtualizer = useVirtualizer({
    count: params.messagesLength,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
    overscan: 10,
    getItemKey: (i) => params.messagesRef.current[i]?.id ?? `__missing__${i}`,
  });

  const computeBottomVisibleMessageId = useCallback(() => {
    const el = parentRef.current;
    if (!el) return undefined;

    const top = el.scrollTop;
    const bottom = top + el.clientHeight;

    let bestId: string | undefined;
    let bestEnd = -1;

    for (const v of rowVirtualizer.getVirtualItems()) {
      const visible = v.end > top && v.start < bottom;
      if (!visible) continue;

      const msg = params.messagesRef.current[v.index];
      if (!msg) continue;

      if (v.end > bestEnd) {
        bestEnd = v.end;
        bestId = msg.id;
      }
    }

    return bestId;
  }, [rowVirtualizer, params.messagesRef, parentRef]);

  const recomputeTail = useCallback(() => {
    const last =
      params.messagesRef.current[params.messagesRef.current.length - 1];
    if (!last) return true;
    return computeBottomVisibleMessageId() === last.id;
  }, [computeBottomVisibleMessageId, params.messagesRef]);

  const scrollToBottom = useCallback(() => {
    const len = params.messagesRef.current.length;
    if (len > 0) rowVirtualizer.scrollToIndex(len - 1, { align: "end" });
  }, [rowVirtualizer, params.messagesRef]);

  const getBottomVisibleUnreadId = useCallback(() => {
    const el = parentRef.current;
    if (!el) return undefined;

    const top = el.scrollTop;
    const bottom = top + el.clientHeight;
    const unread = params.unreadRef.current;

    let bestId: string | undefined;
    let bestEnd = -1;

    for (const v of rowVirtualizer.getVirtualItems()) {
      const visible = v.end > top && v.start < bottom;
      if (!visible) continue;

      const msg = params.messagesRef.current[v.index];
      if (!msg) continue;

      const isMine =
        !!params.currentUserId && msg.sender.id === params.currentUserId;
      if (isMine) continue;

      if (!unread.has(msg.id)) continue;

      if (v.end > bestEnd) {
        bestEnd = v.end;
        bestId = msg.id;
      }
    }

    return bestId;
  }, [
    rowVirtualizer,
    params.messagesRef,
    params.unreadRef,
    params.currentUserId,
    parentRef,
  ]);

  return {
    parentRef,
    rowVirtualizer,
    totalSize: rowVirtualizer.getTotalSize(),
    virtualItems: rowVirtualizer.getVirtualItems() as VirtualItem[],
    measureElement: rowVirtualizer.measureElement,
    computeBottomVisibleMessageId,
    recomputeTail,
    scrollToBottom,
    getBottomVisibleUnreadId,
  };
}
