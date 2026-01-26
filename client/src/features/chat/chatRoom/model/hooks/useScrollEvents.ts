import { useEffect, useRef } from "react";
import type { Message } from "@/entities/chat/model/types";
import type { Virtualizer } from "@tanstack/react-virtual";
import type { Ref } from "./useChatRoomRefs";

const TOP_TRIGGER_PX = 120;
const TOP_RESET_PX = 260;

export function useScrollEvents(params: {
  parentRef: Ref<HTMLDivElement | null>;
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
  messagesRef: Ref<Message[]>;
  queryRef: Ref<any>;
  aliveRef: Ref<boolean>;
  scheduleSaveScroll: () => void;
  scheduleRead: (id?: string) => void;
  getBottomVisibleUnreadId: () => string | undefined;
  recomputeTail: () => boolean;
  newCount: number;
  resetNewCount: () => void;
}) {
  const lastScrollTopRef = useRef(0);
  const fetchPrevLockRef = useRef(false);
  const topLoadArmedRef = useRef(true);

  useEffect(() => {
    const el = params.parentRef.current;
    if (!el) return;

    const fetchPreviousWithAnchor = async () => {
      if (fetchPrevLockRef.current) return;

      const q = params.queryRef.current;
      if (!q || !q.hasPreviousPage || q.isFetchingPreviousPage) return;

      const scrollTop = el.scrollTop;
      const items = params.rowVirtualizer.getVirtualItems();
      const firstVisible = items.find((v) => v.end > scrollTop) ?? items[0];

      const anchorMsg = firstVisible
        ? params.messagesRef.current[firstVisible.index]
        : undefined;

      const anchorId = anchorMsg?.id;
      const anchorDelta = firstVisible ? firstVisible.start - scrollTop : 0;

      fetchPrevLockRef.current = true;
      try {
        await q.fetchPreviousPage();
      } finally {
        fetchPrevLockRef.current = false;
      }

      if (!params.aliveRef.current || !anchorId) return;

      requestAnimationFrame(() => {
        const idx = params.messagesRef.current.findIndex(
          (m) => m.id === anchorId,
        );
        if (idx < 0) return;

        params.rowVirtualizer.scrollToIndex(idx, { align: "start" });

        requestAnimationFrame(() => {
          const el2 = params.parentRef.current;
          if (!el2) return;

          el2.scrollTop = el2.scrollTop - anchorDelta;
          lastScrollTopRef.current = el2.scrollTop;

          params.scheduleSaveScroll();
        });
      });
    };

    const onScroll = () => {
      const curTop = el.scrollTop;
      const goingDown = curTop > lastScrollTopRef.current;
      lastScrollTopRef.current = curTop;

      if (curTop > TOP_RESET_PX) topLoadArmedRef.current = true;

      params.scheduleSaveScroll();

      if (!goingDown && curTop < TOP_TRIGGER_PX && topLoadArmedRef.current) {
        topLoadArmedRef.current = false;
        void fetchPreviousWithAnchor();
      }

      if (goingDown) {
        params.scheduleRead(params.getBottomVisibleUnreadId());
      }

      const atTailNow = params.recomputeTail();
      if (atTailNow && params.newCount > 0) {
        params.resetNewCount();
      }
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [params]);
}
