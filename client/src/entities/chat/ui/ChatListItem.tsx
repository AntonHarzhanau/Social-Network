import type { Chat } from "@/entities/chat/model/types";
import { Item } from "@/shared/components/ui/item";
import { Avatar } from "@/shared/components/Avatar";
import { Badge } from "@/shared/components/ui/badge";
import DropDownButton from "@/shared/components/DropDownButton";

import { useChatRouting } from "@/features/chat/openedChats/lib/useChatRouting";
import { useOpenedChatsStore } from "@/features/chat/openedChats/model/openedChatsStore";

interface ChatListItemProps {
  chat: Chat;
}

const ChatListItem = ({ chat }: ChatListItemProps) => {
  const { openChat, putChatToByIdCache } = useChatRouting();
  const open = useOpenedChatsStore((s) => s.open);

  return (
    <Item
      variant="default"
      className="hover:bg-muted p-2 cursor-pointer"
      onClick={() => {
        putChatToByIdCache(chat);
        open(chat.id);
        openChat(chat.id);
      }}
    >
      <div className="flex items-center gap-2 min-w-0 w-full">
        <Avatar
          imageUrl={chat.avatarUrl}
          alt={chat.title}
          name={chat.title}
          className="w-12 h-12"
        />

        <div className="min-w-0 flex-1">
          <div className="flex justify-between">
            <h2 className="truncate">{chat.title}</h2>
            <div className="flex flex-col items-end gap-1">
              <DropDownButton />
              <Badge variant="outline">{chat.unreadMessageCount}</Badge>
            </div>
          </div>

          <p className="text-sm text-muted-foreground truncate">
            {chat.lastMessage?.content}
          </p>
        </div>
      </div>
    </Item>
  );
};

export default ChatListItem;
