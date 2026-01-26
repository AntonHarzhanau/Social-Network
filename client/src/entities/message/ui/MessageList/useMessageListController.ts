import { useCallback, useEffect, useRef, useState } from "react";
import type { Message } from "@/entities/chat/model/types";

interface UseMessageListControllerArgs {
  chatId: string;
  messages: Message[];

  // индекс последнего прочитанного сообщения (в messages, порядок старые -> новые)
  lastReadIndex: number;
  onReadProgress?: (lastReadMessageId: string) => void;

  onLoadMore?: () => Promise<void> | void;
  hasMore?: boolean;
}

interface UseMessageListControllerReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  bottomRef: React.RefObject<HTMLDivElement | null>;

  isAtBottom: boolean;
  hasUnread: boolean;

  scrollToBottom: () => void;
}

export function useMessageListController({
  chatId,
  messages,
  lastReadIndex,
  onReadProgress,
  onLoadMore,
  hasMore,
}: UseMessageListControllerArgs): UseMessageListControllerReturn {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [isAtBottom, setIsAtBottom] = useState(true);
  const [hasUnread, setHasUnread] = useState(false);

  // guards
  const didRestoreRef = useRef(false);
  const programmaticScrollRef = useRef(false);

  // new message detector (для "New Messages" полоски)
  const prevLastIdRef = useRef<string | null>(null);

  // load-more compensation
  const isLoadingMoreRef = useRef(false);
  const prevScrollHeightRef = useRef(0);
  const prevScrollTopRef = useRef(0);
  const lastLoadMoreAtRef = useRef(0);

  // read-progress debounce
  const readTimerRef = useRef<number | null>(null);
  const pendingReadIdRef = useRef<string | null>(null);

  // reset per chat
  useEffect(() => {
    didRestoreRef.current = false;
    prevLastIdRef.current = null;
    isLoadingMoreRef.current = false;
    lastLoadMoreAtRef.current = 0;

    pendingReadIdRef.current = null;
    if (readTimerRef.current != null) {
      window.clearTimeout(readTimerRef.current);
      readTimerRef.current = null;
    }
  }, [chatId]);

  const runProgrammaticScroll = (fn: () => void) => {
    programmaticScrollRef.current = true;
    fn();
    window.setTimeout(() => {
      programmaticScrollRef.current = false;
    }, 250);
  };

  const scheduleReadProgress = useCallback(
    (messageId: string) => {
      if (!onReadProgress) return;
      if (!messageId) return;

      pendingReadIdRef.current = messageId;

      if (readTimerRef.current != null) return;

      readTimerRef.current = window.setTimeout(() => {
        readTimerRef.current = null;
        const id = pendingReadIdRef.current;
        pendingReadIdRef.current = null;
        if (id) onReadProgress(id);
      }, 250);
    },
    [onReadProgress],
  );

  /**
   * 1) Restore once when messages exist
   * - cursor сохранён в store (msg-<id>) — scrollIntoView
   * - иначе вниз
   */
  useEffect(() => {
    if (didRestoreRef.current) return;
    if (messages.length === 0) return;

    runProgrammaticScroll(() => {
      // восстановление курсора делается снаружи (around), тут просто пытаемся найти msg-<id>
      // если не нашли — идём вниз
      const container = containerRef.current;
      if (!container) return;

      // пробуем восстановить "центр" по любому видимому сообщению вокруг (если в DOM есть #msg-...)
      // если нет — вниз
      bottomRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
      didRestoreRef.current = true;
    });
  }, [messages.length]);

  /**
   * 2) Observe bottom
   * Если внизу — считаем что всё прочитано до последнего сообщения (как минимум по видимому tail)
   */
  useEffect(() => {
    const container = containerRef.current;
    const bottom = bottomRef.current;
    if (!container || !bottom) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const atBottom = entry.isIntersecting;
        setIsAtBottom(atBottom);

        if (atBottom) {
          setHasUnread(false);

          const last = messages[messages.length - 1];
          if (last && messages.length - 1 > lastReadIndex) {
            scheduleReadProgress(last.id);
          }
        }
      },
      { root: container, threshold: 1.0 },
    );

    observer.observe(bottom);
    return () => observer.disconnect();
  }, [messages, lastReadIndex, scheduleReadProgress]);

  /**
   * 3) Load more when near top
   */
  const maybeLoadMore = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!onLoadMore || !hasMore) return;
    if (!didRestoreRef.current) return;
    if (programmaticScrollRef.current) return;
    if (isLoadingMoreRef.current) return;

    if (container.scrollTop > 120) return;

    const now = Date.now();
    if (now - lastLoadMoreAtRef.current < 500) return;
    lastLoadMoreAtRef.current = now;

    isLoadingMoreRef.current = true;
    prevScrollHeightRef.current = container.scrollHeight;
    prevScrollTopRef.current = container.scrollTop;

    const r = onLoadMore();

    const finalize = () => {
      window.setTimeout(() => {
        if (isLoadingMoreRef.current) isLoadingMoreRef.current = false;
      }, 1500);
    };

    if (r && typeof (r as Promise<unknown>).then === "function") {
      (r as Promise<unknown>).catch(console.error).finally(finalize);
    } else {
      finalize();
    }
  }, [onLoadMore, hasMore]);

  /**
   * 4) Compensation after load-more
   */
  useEffect(() => {
    if (!isLoadingMoreRef.current) return;

    const container = containerRef.current;
    if (!container) {
      isLoadingMoreRef.current = false;
      return;
    }

    const newScrollHeight = container.scrollHeight;
    const delta = newScrollHeight - prevScrollHeightRef.current;

    container.scrollTop = prevScrollTopRef.current + delta;
    isLoadingMoreRef.current = false;
  }, [messages.length]);

  /**
   * 5) Scroll listener: loadMore
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      if (programmaticScrollRef.current) return;
      maybeLoadMore();
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", onScroll);
    };
  }, [maybeLoadMore]);

  /**
   * 6) Mark as read gradually (IntersectionObserver по сообщениям)
   * Как только непрочитанное сообщение становится достаточно видимым — двигаем lastReadMessageId вперёд.
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (!onReadProgress) return;
    if (messages.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let bestIndex = -1;
        let bestId: string | null = null;

        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const el = entry.target as HTMLElement;
          const idxRaw = el.dataset.messageIndex;
          const id = el.dataset.messageId;

          if (!idxRaw || !id) continue;

          const idx = Number(idxRaw);
          if (!Number.isFinite(idx)) continue;

          // интересуют только непрочитанные
          if (idx <= lastReadIndex) continue;

          if (idx > bestIndex) {
            bestIndex = idx;
            bestId = id;
          }
        }

        if (bestId) {
          scheduleReadProgress(bestId);
        }
      },
      { root: container, threshold: 0.6 },
    );

    const nodes = container.querySelectorAll<HTMLElement>(
      "[data-message-id][data-message-index]",
    );

    nodes.forEach((n) => observer.observe(n));

    return () => observer.disconnect();
  }, [
    chatId,
    messages.length,
    lastReadIndex,
    onReadProgress,
    scheduleReadProgress,
  ]);

  /**
   * 7) New messages indicator / auto scroll
   */
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last) return;

    const prev = prevLastIdRef.current;
    if (prev === null) {
      prevLastIdRef.current = last.id;
      return;
    }

    if (last.id !== prev) {
      if (isAtBottom) {
        runProgrammaticScroll(() => {
          bottomRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        });

        // если пришло новое и мы внизу — сразу считаем прочитанным
        scheduleReadProgress(last.id);
      } else {
        setHasUnread(true);
      }
      prevLastIdRef.current = last.id;
    }
  }, [messages, isAtBottom, scheduleReadProgress]);

  const scrollToBottom = useCallback(() => {
    runProgrammaticScroll(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
    setHasUnread(false);

    const last = messages[messages.length - 1];
    if (last && messages.length - 1 > lastReadIndex) {
      scheduleReadProgress(last.id);
    }
  }, [messages, lastReadIndex, scheduleReadProgress]);

  return {
    containerRef,
    bottomRef,
    isAtBottom,
    hasUnread,
    scrollToBottom,
  };
}
