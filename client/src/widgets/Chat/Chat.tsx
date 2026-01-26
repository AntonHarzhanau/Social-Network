import { useRef } from "react";

import { Card, CardAction, CardContent } from "@/shared/components/ui/card";
import { Avatar } from "@/shared/components/Avatar";

import MessageList from "@/entities/message/ui/MessageList/MessageList";
import NewMessageForm from "@/entities/message/ui/NewMessageForm";

import { sessionUser } from "@/entities/session/model/sessionStore";
import { useChatUiStore } from "@/entities/chat/model/chatUiStore";
import { useChatQuery } from "@/entities/chat/model/useChat";
import { useChatMessages } from "@/entities/chat/model/useChatMessages";
import { useMarkMessagesAsRead } from "@/entities/chat/model/useMarkMessagesAsRead";

interface MessagesPageProps {
  chatId: string;
}

const Chat = ({ chatId }: MessagesPageProps) => {
  const currentUserId = sessionUser()?.id;

  const savedCursorId = useChatUiStore((s) => s.cursorByChat[chatId] ?? null);
  const anchorByChatRef = useRef<Record<string, string | null>>({});
  if (!(chatId in anchorByChatRef.current)) {
    anchorByChatRef.current[chatId] = savedCursorId;
  }
  const initialAnchorId = anchorByChatRef.current[chatId];

  const chatQuery = useChatQuery(chatId);

  const { messages, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useChatMessages(chatId, initialAnchorId);

  const lastReadMessageId = chatQuery.data?.lastReadMessageId ?? null;

  const { markReadUpTo } = useMarkMessagesAsRead({
    chatId,
    messages,
    currentUserId,
  });

  if (!chatId) return <div>No chat selected</div>;

  if (chatQuery.isLoading) return <div className="p-2">Loading chat…</div>;
  if (chatQuery.isError) return <div className="p-2">Chat not found.</div>;

  const chat = chatQuery.data;

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
          lastReadMessageId={lastReadMessageId}
          onReadProgress={markReadUpTo}
          hasMore={hasNextPage}
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
