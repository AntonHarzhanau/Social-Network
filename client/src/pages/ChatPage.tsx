import { Card } from "@/shared/components/ui/card";
import ChatList from "@/widgets/Chat/ChatList";
import { Link, Navigate, useParams } from "react-router-dom";
import MessagesPage from "../widgets/Chat/Chat";
import { useChatStore } from "@/shared/store/chatStore";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { Button } from "@/shared/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useEffect } from "react";

const ChatPage = () => {
  const params = useParams<{ chatId: string }>();
  const urlChatId = params.chatId || "";

  const chats = useChatStore((state) => state.chats);
  const currentChat = useChatStore((state) => state.currentChateId);
  const removeChat = useChatStore((state) => state.removeChat);
  const changeChat = useChatStore((state) => state.changeCurrentChat);

  useEffect(() => {
    if (urlChatId && urlChatId !== currentChat) {
      changeChat(urlChatId);
    }
  }, [urlChatId, currentChat, changeChat]);

  if (urlChatId && !chats.some((c) => c.id === urlChatId)) {
    return <Navigate to="/chats" replace />;
  }
  return (
    <div className="h-full p-4 flex gap-2">
      <div className="flex-5">
        {urlChatId ? (
          <MessagesPage chatId={currentChat || urlChatId} />
        ) : (
          <ChatList />
        )}
      </div>
      <div className="flex-3">
        <Card>
          {chats.map((chat) => (
            <div key={chat.id} className="flex justify-between p-2">
              <Link to={`/chats/${chat.id}`} className={cn("flex gap-2")}>
                <UserAvatar
                  imageUrl={chat.avatarUrl}
                  name={chat.title}
                  className="w-7 h-7"
                />
                <p>{chat.title}</p>
              </Link>
              <Button variant="ghost" onClick={() => removeChat(chat.id)}>
                <X />
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
