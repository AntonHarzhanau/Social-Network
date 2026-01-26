import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Avatar } from "@/shared/components/Avatar";
import { cn } from "@/shared/lib/utils";
import { Link } from "react-router-dom";

import { useOpenChatsStore } from "@/entities/chat/model/openChatsStore";
import { useChatUiStore } from "@/entities/chat/model/chatUiStore";
import { useChatQuery } from "@/entities/chat/model/useChat";

const OpenChatRow = ({
  chatId,
  isActive,
  onClose,
}: {
  chatId: string;
  isActive: boolean;
  onClose: (chatId: string) => void;
}) => {
  const chatQuery = useChatQuery(chatId);

  const title = chatQuery.data?.title ?? "Chat";
  const avatarUrl = chatQuery.data?.avatarUrl ?? null;

  return (
    <div className="flex p-1 hover:bg-muted rounded-2xl">
      <Link
        to={`/chats/${chatId}`}
        className={cn(
          "flex gap-2 items-center rounded-md w-full min-w-0",
          isActive && "bg-muted",
        )}
      >
        <Avatar imageUrl={avatarUrl} name={title} className="w-7 h-7" />
        <p className="truncate">{title}</p>
      </Link>

      <Button variant="ghost" onClick={() => onClose(chatId)}>
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

const ChatAside = ({ urlChatId }: { urlChatId: string }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const openChatIds = useOpenChatsStore((s) => s.openChatIds);
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
        {openChatIds.map((chatId) => (
          <OpenChatRow
            key={chatId}
            chatId={chatId}
            isActive={urlChatId === chatId}
            onClose={onClose}
          />
        ))}
      </Card>
    </div>
  );
};

export default ChatAside;
