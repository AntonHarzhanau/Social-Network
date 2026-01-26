import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { useChatList } from "../model/useChatList";

import ChatListItem from "./ChatListItem";
import { useInfiniteScrollSentinel } from "@/shared/hooks/useInfiniteScrollSentinel";
import CreateChatDialog from "./CreateChatDialog";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

const ChatList = () => {
  const {
    chats,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useChatList("all");

  const sentinelRef = useInfiniteScrollSentinel({
    enabled: !isLoading && !isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  return (
    <Card className="h-[75vh] md:h-[80vh] lg:h-[90vh] flex flex-col">
      <CardHeader className="shrink-0">
        <CreateChatDialog />
      </CardHeader>

      <CardContent className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          {isError && <div>Error: {error.message}</div>}
          {chats.map((chat) => (
            <ChatListItem key={chat.id} chat={chat} />
          ))}
          <div ref={sentinelRef} />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ChatList;
