import { useEffect, useRef } from "react";
import type { Message } from "@/entities/chat/model/types";
import type { Ref } from "./useChatRoomRefs";

export function useInitialRestore(params: {
  chatId?: string;
  openStateRef: Ref<any>;
  parentRef: Ref<HTMLDivElement | null>;
  messagesRef: Ref<Message[]>;
  unreadRef: Ref<Set<string>>;
  queryRef: Ref<any>;
  aliveRef: Ref<boolean>;
  rowVirtualizer: any;
  scrollToBottom: () => void;
  recomputeTail: () => boolean;
  setIsAtTail: (v: boolean) => void;
  setNewCount: (v: number) => void;
  scheduleSaveScroll: () => void;
  scheduleRead: (id?: string) => void;
  getBottomVisibleUnreadId: () => string | undefined;
  currentUserId?: string;
}) {
  const didInitRef = useRef(false);

  useEffect(() => {
    if (!params.chatId) return;
    if (!params.messagesRef.current.length) return;
    if (didInitRef.current) return;
    didInitRef.current = true;

    const anchorId = params.openStateRef.current?.bottomVisibleMessageId;

    const computeNewCountFromAnchor = () => {
      if (!anchorId) return 0;
      const idx = params.messagesRef.current.findIndex(
        (m) => m.id === anchorId,
      );
      if (idx < 0) return 0;

      let c = 0;
      const unread = params.unreadRef.current;
      for (let i = idx + 1; i < params.messagesRef.current.length; i++) {
        const m = params.messagesRef.current[i];
        const isMine =
          !!params.currentUserId && m.sender.id === params.currentUserId;
        if (isMine) continue;
        if (unread.has(m.id)) c++;
      }
      return c;
    };

    const goTail = () => {
      requestAnimationFrame(() => {
        if (!params.aliveRef.current) return;
        params.scrollToBottom();
        requestAnimationFrame(() => {
          if (!params.aliveRef.current) return;
          const atTail = params.recomputeTail();
          params.setIsAtTail(atTail);
          params.setNewCount(0);
          if (atTail) params.scheduleRead(params.getBottomVisibleUnreadId());
          params.scheduleSaveScroll();
        });
      });
    };

    if (!anchorId) return goTail();

    (async () => {
      for (let i = 0; i < 12; i++) {
        const idx = params.messagesRef.current.findIndex(
          (m) => m.id === anchorId,
        );
        if (idx >= 0) {
          requestAnimationFrame(() => {
            if (!params.aliveRef.current) return;
            params.rowVirtualizer.scrollToIndex(idx, { align: "end" });
            requestAnimationFrame(() => {
              if (!params.aliveRef.current) return;
              const atTail = params.recomputeTail();
              params.setIsAtTail(atTail);
              params.setNewCount(atTail ? 0 : computeNewCountFromAnchor());
              if (atTail)
                params.scheduleRead(params.getBottomVisibleUnreadId());
              params.scheduleSaveScroll();
            });
          });
          return;
        }

        const q = params.queryRef.current;
        const el = params.parentRef.current;
        if (!q?.hasPreviousPage || q.isFetchingPreviousPage || !el) break;

        const beforeH = el.scrollHeight;
        const beforeTop = el.scrollTop;

        await q.fetchPreviousPage();
        if (!params.aliveRef.current) return;

        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => {
            const afterH = el.scrollHeight;
            el.scrollTop = beforeTop + (afterH - beforeH);
            resolve();
          }),
        );
      }

      goTail();
    })();
  }, [params]);
}
