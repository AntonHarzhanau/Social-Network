import { useCallback, useEffect, useRef, useState } from "react";
import type { Message } from "@/entities/chat/model/types";

interface UseMessageListControllerArgs {
  chatId: string;
  messages: Message[];
  cursorId: string | null;
  setCursor: (chatId: string, messageId: string | null) => void;

  onLoadMore?: () => Promise<void> | void;
  hasMore?: boolean;
}

interface UseMessageListControllerReturn {
  containerRef: React.RefObject<HTMLDivElement | null> ;
  bottomRef: React.RefObject<HTMLDivElement | null> ;

  isAtBottom: boolean;
  hasUnread: boolean;

  scrollToBottom: () => void;
}

export function useMessageListController({
  chatId,
  messages,
  cursorId,
  setCursor,
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

  // new message detector
  const prevLastIdRef = useRef<string | null>(null);

  // load-more compensation
  const isLoadingMoreRef = useRef(false);
  const prevScrollHeightRef = useRef(0);
  const prevScrollTopRef = useRef(0);
  const lastLoadMoreAtRef = useRef(0);

  // reset per chat
  useEffect(() => {
    didRestoreRef.current = false;
    prevLastIdRef.current = null;
    isLoadingMoreRef.current = false;
    lastLoadMoreAtRef.current = 0;
  }, [chatId]);

  const runProgrammaticScroll = (fn: () => void) => {
    programmaticScrollRef.current = true;
    fn();
    window.setTimeout(() => {
      programmaticScrollRef.current = false;
    }, 250);
  };

  /**
   * 1) Restore once when messages exist
   * cursor == null -> bottom
   * cursor != null -> scroll to msg
   *
   * Depend on cursorId to support late server cursor,
   * but guarded by didRestoreRef.
   */
  useEffect(() => {
    if (didRestoreRef.current) return;
    if (messages.length === 0) return;

    runProgrammaticScroll(() => {
      if (cursorId) {
        const el = document.getElementById(`msg-${cursorId}`);
        if (el) {
          el.scrollIntoView({ behavior: "auto", block: "center" });
          didRestoreRef.current = true;
          return;
        }
      }
      bottomRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
      didRestoreRef.current = true;
    });
  }, [messages.length, cursorId]);

  /**
   * 2) Observe bottom
   * If at bottom -> cursor = null (semantic: open at bottom next time)
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
          setCursor(chatId, null);
        }
      },
      { root: container, threshold: 1.0 },
    );

    observer.observe(bottom);
    return () => observer.disconnect();
  }, [chatId, setCursor]);

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
   * 5) Save cursor from viewport
   */
  const saveCursorFromViewport = useCallback(() => {
    if (programmaticScrollRef.current) return;

    const container = containerRef.current;
    if (!container) return;

    const isBottomNow =
      container.scrollHeight - (container.scrollTop + container.clientHeight) < 2;

    if (isBottomNow) {
      setCursor(chatId, null);
      return;
    }

    const rect = container.getBoundingClientRect();
    const x = rect.left + 16;
    const y = rect.top + rect.height / 3;

    const el = document.elementFromPoint(x, y) as HTMLElement | null;
    const msgEl = el?.closest?.("[data-message-id]") as HTMLElement | null;
    const id = msgEl?.dataset.messageId;

    if (id) setCursor(chatId, id);
  }, [chatId, setCursor]);

  /**
   * Scroll listener: loadMore + cursor (debounced)
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let t: number | null = null;

    const onScroll = () => {
      if (programmaticScrollRef.current) return;

      maybeLoadMore();

      if (t) window.clearTimeout(t);
      t = window.setTimeout(saveCursorFromViewport, 150);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", onScroll);
      if (t) window.clearTimeout(t);
    };
  }, [maybeLoadMore, saveCursorFromViewport]);

  /**
   * 6) New messages indicator / auto scroll
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
          bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        });
      } else {
        setHasUnread(true);
      }
      prevLastIdRef.current = last.id;
    }
  }, [messages, isAtBottom]);

  const scrollToBottom = useCallback(() => {
    runProgrammaticScroll(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
    setHasUnread(false);
    setCursor(chatId, null);
  }, [chatId, setCursor]);

  return {
    containerRef,
    bottomRef,
    isAtBottom,
    hasUnread,
    scrollToBottom,
  };
}
