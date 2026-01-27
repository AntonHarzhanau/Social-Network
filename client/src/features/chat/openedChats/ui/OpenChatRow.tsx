import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useChatRouting } from "../lib/useChatRouting";
import type { Chat } from "@/entities/chat/model/types";
import { chatKeys } from "@/entities/chat/model/queryKeys";
import { OpenChatRowSkeleton } from "./OpenChatRowSkeleton";
import { Button } from "@/shared/components/ui/button";
import { X } from "lucide-react";
import { Avatar } from "@/shared/components/Avatar";

export const OpenChatRow = ({
  chatId,
  active,
  currentChatId,
}: {
  chatId: string;
  active: boolean;
  currentChatId: string;
}) => {
  const qc = useQueryClient();
  const { goToChat, closeChatFromSidebar } = useChatRouting();

  const { data: chat } = useQuery<Chat | undefined>({
    queryKey: chatKeys.byId(chatId),
    queryFn: async () => qc.getQueryData<Chat>(chatKeys.byId(chatId)),
    initialData: () => qc.getQueryData<Chat>(chatKeys.byId(chatId)),
    enabled: false,
    staleTime: Infinity,
  });

  if (!chat) return <OpenChatRowSkeleton active={active} />;

  const title = chat.title ?? "Chat";

  return (
    <div
      className={`flex items-center gap-2 rounded-md p-1 ${
        active ? "bg-accent/70" : "hover:bg-accent/50"
      }`}
    >
      <button
        className="flex items-center gap-2 min-w-0 flex-1 text-left"
        onClick={() => goToChat(chatId)}
      >
        <Avatar imageUrl={chat.avatarUrl} name={title} className="h-8 w-8" />
        <span className="truncate">{title}</span>
      </button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => closeChatFromSidebar(chatId, currentChatId)}
        aria-label="Close chat"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
