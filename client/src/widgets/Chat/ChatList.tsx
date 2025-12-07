import { useEffect, useRef } from "react";
import ChatListItem from "./ChatListItem";
import { useInfiniteChats } from "@/shared/hooks/useChat";

const ChatList = () => {
  const { data, fetchNextPage, hasNextPage, status } =
    useInfiniteChats();

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage) return;

    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1 },
    );
    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage]);

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Failed to load chats.</div>;
  }

  const chats = data?.pages.flat() ?? [];

  return (
    <div className="flex flex-col">
      {chats.map((chat) => (
        <ChatListItem key={chat.id} chat={chat} />
      ))}
      <div ref={loadMoreRef} />
    </div>
  );
};

export default ChatList;
