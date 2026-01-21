import { useChatUiStore } from "@/entities/chat/model/chatUiStore";
import { useOpenChatsStore } from "@/entities/chat/model/openChatsStore";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Avatar } from "@/shared/components/Avatar";
import { cn } from "@/shared/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const ChatAside = ({ urlChatId }: { urlChatId: string }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const openChats = useOpenChatsStore((s) => s.openChats);
  const closeOpenChat = useOpenChatsStore((s) => s.closeChat);

  const closeUiChat = useChatUiStore((s) => s.closeChat);

  const onClose = (chatId: string) => {
    closeUiChat(chatId);
    closeOpenChat(chatId);

    queryClient.removeQueries({ queryKey: ["messages", chatId] });
    queryClient.removeQueries({ queryKey: ["chat", chatId] });

    if (urlChatId === chatId) {
      navigate("/chats", { replace: true });
    }
  };
  return (
    <div className="flex-3 h-fit sticky top-14 p-2">
      <Card className="py-2 gap-1">
        {openChats.map((chat) => (
          <div key={chat.id} className="flex p-1 hover:bg-muted rounded-2xl">
            <Link
              to={`/chats/${chat.id}`}
              className={cn("flex gap-2 items-center rounded-md w-full")}
            >
              <Avatar
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
  );
};

export default ChatAside;
