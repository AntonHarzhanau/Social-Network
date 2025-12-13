import type { MessageResponse } from "@/shared/api/chat";
import { Button } from "@/shared/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import MessageItem from "./MessageItem";

interface MessageListProps {
  messages: MessageResponse[];
  currentUserId?: string;
  onLoadMore?: () => Promise<void> | void;
  hasMore?: boolean;
}

const MessageList = ({
  messages,
  currentUserId,
  onLoadMore,
  hasMore,
}: MessageListProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const topRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [isAtBottom, setIsAtBottom] = useState(true);
  const [hasUnread, setHasUnread] = useState(false);

  const initialScrollDoneRef = useRef(false);
  const prevLastMessageIdRef = useRef<string | undefined>(undefined);

  const isLoadingMoreRef = useRef(false);
  const prevScrollHeightRef = useRef(0);
  const prevScrollTopRef = useRef(0);

  // 1) При первом появлении сообщений — скроллим к последнему
  useEffect(() => {
    if (initialScrollDoneRef.current) return;
    if (!bottomRef.current) return;
    if (messages.length === 0) return;

    bottomRef.current.scrollIntoView({
      behavior: "auto",
      block: "end",
    });

    initialScrollDoneRef.current = true;
  }, [messages.length]);

  // 2) Следим, находимся ли мы внизу (через bottomRef)
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
        }
      },
      {
        root: container,
        threshold: 1.0,
      },
    );

    observer.observe(bottom);
    return () => observer.disconnect();
  }, [messages.length]); // при изменении количества сообщений пересчитаем

  // 3) Инфинити-скролл вверх: грузим только когда реально долистали до верха,
  // и сохраняем позицию после подгрузки
  useEffect(() => {
    if (!onLoadMore || !hasMore) return;

    const container = containerRef.current;
    const top = topRef.current;
    if (!container || !top) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (isLoadingMoreRef.current) return;

        // фиксируем позицию до загрузки
        isLoadingMoreRef.current = true;
        prevScrollHeightRef.current = container.scrollHeight;
        prevScrollTopRef.current = container.scrollTop;

        const result = onLoadMore();
        if (result && typeof (result as Promise<unknown>).then === "function") {
          (result as Promise<unknown>).catch((err) =>
            console.error("loadMore error", err),
          );
        }
      },
      {
        root: container,
        threshold: 0.1,
      },
    );

    observer.observe(top);
    return () => observer.disconnect();
  }, [onLoadMore, hasMore]);

  // 4) После того как подгрузились новые сообщения сверху — компенсируем скролл
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

  // 5) Реакция на появление нового последнего сообщения (Mercure / отправка)
  useEffect(() => {
    const last = messages[messages.length - 1];
    const prevLastId = prevLastMessageIdRef.current;
    if (!last) return;

    // первый рендер — просто запоминаем
    if (!prevLastId) {
      prevLastMessageIdRef.current = last.id;
      return;
    }

    if (last.id !== prevLastId) {
      // новое сообщение
      if (isAtBottom) {
        // если внизу — плавно прокручиваем вниз
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      } else {
        // если не внизу — показываем индикатор
        setHasUnread(true);
      }

      prevLastMessageIdRef.current = last.id;
    }
  }, [messages, isAtBottom]);

  const handleScrollToBottom = () => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
    setHasUnread(false);
  };

  return (
    <div className="relative h-[65vh] w-full ">
      <div ref={containerRef} className="h-full w-full overflow-y-auto p-0">
        <div ref={topRef} />
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} currentUserId={currentUserId} />
        ))}
        <div ref={bottomRef} />

        {!isAtBottom && (
          <div className="">
            {hasUnread && (
              <div
              onClick={handleScrollToBottom} 
              className="absolute bottom-0 left-0 w-full h-12 flex justify-center items-center bg-muted/50">
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
