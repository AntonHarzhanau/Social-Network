import { CardHeader } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Avatar } from "@/shared/components/Avatar";
import ChatInfo from "../../../features/chat/chatInfo/ui/ChatInfo";
import type { Chat } from "../model/types";
import { X } from "lucide-react";

export function ChatRoomHeader(props: { chat: Chat; onClose: () => void }) {
  const { chat, onClose } = props;

  return (
    <CardHeader className="shrink-0 flex items-center justify-between gap-2 px-1 py-0">
      <ChatInfo chat={chat}>
        <div className="flex items-center gap-1 min-w-0">
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X />
          </Button>
          <Avatar
            imageUrl={chat.avatarUrl}
            name={chat.title}
            className="h-10 w-10 shrink-0"
          />
          <div className="min-w-0">
            <div className="font-medium truncate">{chat.title}</div>
          </div>
        </div>
      </ChatInfo>
    </CardHeader>
  );
}
