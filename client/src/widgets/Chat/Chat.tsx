import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/shared/components/ui/card";

import { UserAvatar } from "@/shared/components/UserAvatar";
import { useAuthStore } from "@/shared/store/authStore";
import MessageList from "@/widgets/Message/MessageList";
import { useChatStore } from "@/shared/store/chatStore";
import { useChatMessages } from "@/shared/hooks/useChatMessages";
import NewMessageForm from "./NewMessageForm";

interface MessagesPageProps {
  chatId: string;
}

const Chat = ({ chatId }: MessagesPageProps) => {
  
  const currentUserId = useAuthStore((state) => state.user?.id);
  const chat = useChatStore((s) => s.chats.find((c) => c.id === chatId));
  const { messages, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useChatMessages(chatId);

  if (!chatId) {
    return <div>No chat selected</div>;
  }

  return (
    <Card className="flex flex-col gap-2 h-full">
      <CardHeader className="flex items-center gap-3 border-b px-3 py-1">
        <UserAvatar
          imageUrl={chat?.avatarUrl}
          name={chat?.title ?? "Chat"}
          className="w-12 h-12"
        />
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold">{chat?.title ?? "Chat"}</h2>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 p-2">
        {isFetchingNextPage && (
          <div className="text-center text-xs text-muted-foreground">
            Loading messages…
          </div>
        )}
        <MessageList
          messages={messages}
          currentUserId={currentUserId}
          hasMore={!!hasNextPage}
          onLoadMore={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
        />
      </CardContent>

      <CardAction className="w-full">
        <NewMessageForm chatId={chatId} />
      </CardAction>
    </Card>
  );
};

export default Chat;
