import type { Chat } from "@/entities/chat/model/types";
import { Item } from "@/shared/components/ui/item";
import { Avatar } from "@/shared/components/Avatar";
import { Badge } from "@/shared/components/ui/badge";
import { useChatRouting } from "@/features/chat/openedChats/lib/useChatRouting";
import { useOpenedChatsStore } from "@/features/chat/openedChats/model/openedChatsStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { sessionStore } from "@/entities/session/model/sessionStore";
import { useRemoveMemberMutation } from "../model/hooks/useChatMutation";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useState } from "react";

interface ChatListItemProps {
  chat: Chat;
}

const ChatListItem = ({ chat }: ChatListItemProps) => {
  const userId = sessionStore((s) => s.user?.id);
  const { openChat, putChatToByIdCache } = useChatRouting();
  const leaveChat = useRemoveMemberMutation();
  const open = useOpenedChatsStore((s) => s.open);
  const [confirmOpen, setConfirmOpen] = useState(false);
  return (
    <Item
      variant="default"
      className="hover:bg-muted p-2 cursor-pointer w-full min-w-0"
      onClick={() => {
        putChatToByIdCache(chat);
        open(chat.id);
        openChat(chat.id);
      }}
    >
      <div className="flex items-center gap-2 w-full min-w-0">
        <Avatar
          imageUrl={chat.avatarUrl}
          name={chat.title}
          className="h-12 w-12 shrink-0"
        />

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="flex flex-col flex-1 w-0 overflow-hidden">
            <h2 className="truncate">{chat.title}</h2>
            <p className="text-sm text-muted-foreground truncate">
              {chat.lastMessage?.content}
            </p>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            className="flex flex-col gap-1 items-end shrink-0 flex-none"
          >
            <DropdownMenu>
              <DropdownMenuTrigger className="">
                <Ellipsis />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card p-2 rounded-2xl">
                <DropdownMenuItem
                  className="text-destructive focus:bg-destructive/10"
                  onSelect={() => setConfirmOpen(true)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Badge variant="outline">{chat.unreadMessageCount}</Badge>
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete chat?"
        description="This will remove the chat from your list."
        confirmText="Delete"
        destructive
        isLoading={leaveChat.isPending}
        disabled={!userId}
        onConfirm={() => {
          if (!userId) return;
          leaveChat.mutateAsync({ chatId: chat.id, userId });
        }}
      />
    </Item>
  );
};

export default ChatListItem;
