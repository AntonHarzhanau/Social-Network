import { sendMessage, type MessageResponse } from "@/shared/api/chat";
import {
  useChatQuery,
  useInfiniteMessages,
} from "@/shared/hooks/useChat";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { useAuthStore } from "@/shared/store/authStore";
import MessageList from "@/widgets/Message/MessageList";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MERCURE_URL =
  import.meta.env.VITE_MERCURE_URL ?? "http://localhost/.well-known/mercure";

const ChatPage = () => {
  const params = useParams<{ chatId: string }>();
  const chatId = params.chatId;
  const [newMessage, setNewMessage] = useState("");
  const [liveMessages, setLiveMessages] = useState<MessageResponse[]>([]);
  const currentUserId = useAuthStore((state) => state.user?.id);

  const { data: chat } = useChatQuery(chatId);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteMessages(chatId);

  const historyMessages =
    data?.pages
      .flat()
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ) ?? [];

  const messages = [...historyMessages, ...liveMessages]
    .filter(
      (msg, index, arr) => arr.findIndex((m) => m.id === msg.id) === index,
    )
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

  useEffect(() => {
    if (!chatId) return;

    const topic = `https://qynso.local/chats/${chatId}`;
    const url = new URL(MERCURE_URL);
    url.searchParams.append("topic", topic);

    const es = new EventSource(url.toString());

    es.onmessage = (event) => {
      const data = JSON.parse(event.data) as {
        type: string;
        message: MessageResponse;
      };

      if (data.type !== "message_created") return;

      const newMsg = data.message;

      setLiveMessages((prevMessages) => {
        if (prevMessages.find((msg) => msg.id === newMsg.id)) {
            return prevMessages;
        }
        return [...prevMessages, newMsg];
      });
    };

    es.onerror = (err) => {
      console.error("Mercure error", err);
    };

    return () => {
      es.close();
    };
  }, [chatId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatId || !newMessage.trim()) return;
    await sendMessage(chatId, newMessage);
    setNewMessage("");
  };

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
        <form
          onSubmit={handleSendMessage}
          className="flex w-full gap-2 px-2 items-center"
        >
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <Button type="submit">Send</Button>
        </form>
      </CardAction>
    </Card>
  );
};

export default ChatPage;
export const Component = ChatPage;
