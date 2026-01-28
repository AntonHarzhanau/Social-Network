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
import { Ellipsis, VolumeOff } from "lucide-react";
import { sessionStore } from "@/entities/session/model/sessionStore";
import {
  useMuteChatMutation,
  useRemoveMemberMutation,
} from "../model/hooks/useChatMutation";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useState } from "react";

interface ChatListItemProps {
  chat: Chat;
}

const ChatListItem = ({ chat }: ChatListItemProps) => {
  const userId = sessionStore((s) => s.user?.id);
  const { openChat, putChatToByIdCache } = useChatRouting();
  const leaveChat = useRemoveMemberMutation();
  const toggleMute = useMuteChatMutation();
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
            <div className="flex gap-2 items-baseline">
              <h2 className="truncate">{chat.title}</h2>
              {chat.isMuted && (
                <Badge variant="outline" className="p-0.5">
                  <VolumeOff size={12} strokeWidth={2.25} />
                </Badge>
              )}
            </div>
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
                  className="text-accent-foreground focus:bg-accent-foreground/10"
                  onSelect={() => toggleMute.mutate(chat.id)}
                >
                  {chat.isMuted ? "Unmute" : "Mute"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:bg-destructive/10"
                  onSelect={() => setConfirmOpen(true)}
                >
                  Leave
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
