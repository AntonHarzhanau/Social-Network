import { Card, CardAction, CardContent } from "@/shared/components/ui/card";
import { Avatar } from "@/shared/components/Avatar";
import MessageList from "@/entities/message/ui/MessageList/MessageList";
import { useChatMessages } from "@/entities/chat/model/useChatMessages";
import NewMessageForm from "@/entities/message/ui/NewMessageForm";
import { useOpenChatsStore } from "@/entities/chat/model/openChatsStore";
import { sessionUser } from "@/entities/session/model/sessionStore";

interface MessagesPageProps {
  chatId: string;
}

const Chat = ({ chatId }: MessagesPageProps) => {
  const currentUserId = sessionUser()?.id;
  const chat = useOpenChatsStore((s) =>
    s.openChats.find((c) => c.id === chatId),
  );
  const { messages, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useChatMessages(chatId);

  if (!chatId) {
    return <div>No chat selected</div>;
  }

  return (
    <Card className="flex flex-col gap-2 py-4 px-2">
      <div className="flex items-center gap-3 p-2 border-b">
        <Avatar
          imageUrl={chat?.avatarUrl}
          name={chat?.title ?? "Chat"}
          className="w-12 h-12"
        />
        <h2 className="text-lg font-semibold">{chat?.title ?? "Chat"}</h2>
      </div>

      <CardContent className="flex flex-col gap-2 p-0">
        {isFetchingNextPage && (
          <div className="text-center text-xs text-muted-foreground">
            Loading messages…
          </div>
        )}
        <MessageList
          chatId={chatId}
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

      <CardAction className="w-full shadow-t-md pt-2 border-t">
        <NewMessageForm chatId={chatId} />
      </CardAction>
    </Card>
  );
};

export default Chat;
