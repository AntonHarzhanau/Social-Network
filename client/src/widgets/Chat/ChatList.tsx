import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { useChatList } from "../../entities/chat/model/hooks/useChatList";

import ChatListItem from "../../entities/chat/ui/ChatListItem";
import { useInfiniteScrollSentinel } from "@/shared/hooks/useInfiniteScrollSentinel";
import CreateChatDialog from "../../entities/chat/ui/CreateChatDialog";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useChatFilterStore } from "@/features/chat/chatFilter/model/useChatFilterStore";

const ChatList = () => {
  const filter = useChatFilterStore((s) => s.filter);
  const {
    chats,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useChatList(filter ?? "all");

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
