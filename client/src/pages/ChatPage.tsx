import { Card } from "@/shared/components/ui/card";
import ChatList from "@/widgets/Chat/ChatList";
import { Link, Navigate, useParams } from "react-router-dom";
import Chat from "../widgets/Chat/Chat";
import { useChatStore } from "@/shared/store/chatStore";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { Button } from "@/shared/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const ChatPage = () => {
  const params = useParams<{ chatId: string }>();
  const urlChatId = params.chatId || "";

  const chats = useChatStore((state) => state.chats);
  const removeChat = useChatStore((state) => state.removeChat);

  if (urlChatId && !chats.some((c) => c.id === urlChatId)) {
    return <Navigate to="/chats" replace />;
  }
  return (
    <div className="h-full p-4 flex gap-2">
      <div className="flex-5 min-w-0">
        {urlChatId ? (
          <Chat chatId={urlChatId} />
        ) : (
          <ChatList />
        )}
      </div>
      <div className="flex-3">
        <Card className="py-2 gap-1">
          {chats.map((chat) => (
            <div key={chat.id} className="flex p-1 hover:bg-muted rounded-2xl">
              <Link to={`/chats/${chat.id}`} className={cn("flex gap-2 items-center  rounded-md w-full")}>
                <UserAvatar
                  imageUrl={chat.avatarUrl}
                  name={chat.title}
                  className="w-7 h-7"
                />
                <p>{chat.title}</p>
              </Link>
              <Button variant="ghost" onClick={() => removeChat(chat.id)} className="">
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
