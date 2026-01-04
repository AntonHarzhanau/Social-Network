import { Card } from "@/shared/components/ui/card";
import ChatList from "@/widgets/Chat/ChatList";
import { Link, useParams, useNavigate } from "react-router-dom";
import Chat from "../widgets/Chat/Chat";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { Button } from "@/shared/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useChatUiStore } from "@/shared/store/chatUiStore";
import { useOpenChatsStore } from "@/shared/store/openChatsStore";
import { useChatQuery } from "@/shared/hooks/useChat";

const ChatPage = () => {
  const { chatId: urlChatId = "" } = useParams<{ chatId: string }>();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const openChats = useOpenChatsStore((s) => s.openChats);
  const openChat = useOpenChatsStore((s) => s.openChat);
  const closeOpenChat = useOpenChatsStore((s) => s.closeChat);

  const closeUiChat = useChatUiStore((s) => s.closeChat);

  const isAlreadyOpen = !!urlChatId && openChats.some((c) => c.id === urlChatId);
  const chatQuery = useChatQuery(urlChatId);

  if (urlChatId && !isAlreadyOpen && chatQuery.data) {
    openChat(chatQuery.data);
  }

  const onClose = (chatId: string) => {
    closeUiChat(chatId);
    closeOpenChat(chatId);

    queryClient.removeQueries({ queryKey: ["messages", chatId] });
    // опционально:
    queryClient.removeQueries({ queryKey: ["chat", chatId] });

    if (urlChatId === chatId) {
      navigate("/chats", { replace: true });
    }
  };

  // Если URL есть и чат ещё не загружен
  if (urlChatId && !isAlreadyOpen) {
    if (chatQuery.isLoading) return <div className="p-2">Loading chat…</div>;
    if (chatQuery.isError) return <div className="p-2">Chat not found.</div>;
  }

  return (
    <div className="flex gap-2 p-2">
      <div className="flex flex-col flex-5 gap-2 min-w-0">
        {urlChatId ? <Chat chatId={urlChatId} /> : <ChatList />}
      </div>

      <div className="flex-3 h-fit sticky top-14 p-2">
        <Card className="py-2 gap-1">
          {openChats.map((chat) => (
            <div key={chat.id} className="flex p-1 hover:bg-muted rounded-2xl">
              <Link
                to={`/chats/${chat.id}`}
                className={cn("flex gap-2 items-center rounded-md w-full")}
              >
                <UserAvatar
                  imageUrl={chat.avatarUrl}
                  name={chat.title}
                  className="w-7 h-7"
                />
                <p>{chat.title}</p>
              </Link>

              <Button
                variant="ghost"
                onClick={() => onClose(chat.id)}
                className=""
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default ChatPage;
export const Component = ChatPage;
