import type { MessageResponse } from "@/shared/api/chat";
import { Button } from "@/shared/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import MessageItem from "./MessageItem";
import { useChatUiStore } from "@/shared/store/chatUiStore";

interface MessageListProps {
  chatId: string;
  messages: MessageResponse[];
  currentUserId?: string;
  onLoadMore?: () => Promise<void> | void;
  hasMore?: boolean;
}

const MessageList = ({
  chatId,
  messages,
  currentUserId,
  onLoadMore,
  hasMore,
}: MessageListProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [isAtBottom, setIsAtBottom] = useState(true);
  const [hasUnread, setHasUnread] = useState(false);

  const anchorId = useChatUiStore((s) => s.scrollAnchorByChat[chatId]);
  const lastReadId = useChatUiStore((s) => s.lastReadByChat[chatId]);
  const setAnchor = useChatUiStore((s) => s.setScrollAnchor);
  const setLastRead = useChatUiStore((s) => s.setLastRead);

  // --- защита от зацикливания ---
  const didRestoreRef = useRef(false);
  const programmaticScrollRef = useRef(false);

  // для "новое сообщение"
  const prevLastIdRef = useRef<string | null>(null);

  // для компенсации при подгрузке старых
  const isLoadingMoreRef = useRef(false);
  const prevScrollHeightRef = useRef(0);
  const prevScrollTopRef = useRef(0);

  // анти-спам для loadMore
  const lastLoadMoreAtRef = useRef(0);

  // сбрасываем флаги при смене чата
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

  // 1) Восстановление позиции: ТОЛЬКО ОДИН РАЗ после первой загрузки сообщений
  useEffect(() => {
    if (didRestoreRef.current) return;
    if (messages.length === 0) return;

    const target = anchorId ?? lastReadId;

    runProgrammaticScroll(() => {
      if (target) {
        const el = document.getElementById(`msg-${target}`);
        if (el) {
          el.scrollIntoView({ behavior: "auto", block: "center" });
          didRestoreRef.current = true;
          return;
        }
      }

      // fallback: вниз
      bottomRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
      didRestoreRef.current = true;
    });
  }, [messages.length]); // намеренно НЕ зависим от anchorId/lastReadId

  // 2) Отслеживаем bottom
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
          if (last) setLastRead(chatId, last.id);
        }
      },
      { root: container, threshold: 1.0 },
    );

    observer.observe(bottom);
    return () => observer.disconnect();
  }, [chatId, messages, setLastRead]);

  // 3) Пытаемся догружать старые по scrollTop (надежнее, чем IntersectionObserver для topRef)
  const maybeLoadMore = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!onLoadMore || !hasMore) return;
    if (!didRestoreRef.current) return;
    if (programmaticScrollRef.current) return;
    if (isLoadingMoreRef.current) return;

    // “почти верх”
    if (container.scrollTop > 120) return;

    // throttling
    const now = Date.now();
    if (now - lastLoadMoreAtRef.current < 500) return;
    lastLoadMoreAtRef.current = now;

    isLoadingMoreRef.current = true;
    prevScrollHeightRef.current = container.scrollHeight;
    prevScrollTopRef.current = container.scrollTop;

    const r = onLoadMore();

    // safety: если по какой-то причине messages.length не изменится,
    // сбросим флаг через таймаут, чтобы не "залипнуть"
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

  // 4) Компенсация скролла после подгрузки старых сообщений
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

  // 5) Сохраняем anchor (где остановился), но игнорируем programmatic scroll
  const saveAnchorFromViewport = useCallback(() => {
    if (programmaticScrollRef.current) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = rect.left + 16;
    const y = rect.top + rect.height / 3;

    const el = document.elementFromPoint(x, y) as HTMLElement | null;
    const msgEl = el?.closest?.("[data-message-id]") as HTMLElement | null;
    const id = msgEl?.dataset.messageId;

    if (id) setAnchor(chatId, id);
  }, [chatId, setAnchor]);

  // scroll listener: loadMore + anchor
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let t: number | null = null;

    const onScroll = () => {
      if (programmaticScrollRef.current) return;

      // 1) сперва пытаемся догрузить старые
      maybeLoadMore();

      // 2) затем (debounced) сохраняем anchor
      if (t) window.clearTimeout(t);
      t = window.setTimeout(saveAnchorFromViewport, 150);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", onScroll);
      if (t) window.clearTimeout(t);
    };
  }, [saveAnchorFromViewport, maybeLoadMore]);

  // 6) Новое сообщение: не реагируем на первый рендер
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
      } else {
        setHasUnread(true);
      }
      prevLastIdRef.current = last.id;
    }
  }, [messages, isAtBottom]);

  const handleScrollToBottom = () => {
    runProgrammaticScroll(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
    setHasUnread(false);
  };

  return (
    <div className="relative h-[65vh] w-full">
      <div ref={containerRef} className="h-full w-full overflow-y-auto p-0">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            chatId={chatId}
            message={message}
            currentUserId={currentUserId}
          />
        ))}
        <div ref={bottomRef} />

        {!isAtBottom && (
          <div>
            {hasUnread && (
              <div
                onClick={handleScrollToBottom}
                className="absolute bottom-0 left-0 w-full h-12 flex justify-center items-center bg-muted/50"
              >
                New Messages
              </div>
            )}

            <Button
              onClick={handleScrollToBottom}
              size="icon"
              className="absolute bottom-4 right-4 rounded-full bg-primary/40 px-3 py-1 text-xs text-primary-foreground shadow-md flex items-center gap-1"
            >
              <ChevronDown size={16} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageList;
