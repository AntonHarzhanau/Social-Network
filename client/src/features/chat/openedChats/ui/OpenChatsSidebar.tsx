import { X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Avatar } from "@/shared/components/Avatar";
import { Button } from "@/shared/components/ui/button";

import type { Chat } from "@/entities/chat/model/types";
import { chatKeys } from "@/entities/chat/model/queryKeys";

import { useOpenedChatsStore } from "../model/openedChatsStore";
import { useChatRouting } from "../lib/useChatRouting";

export function OpenChatsSidebar(props: { currentChatId: string }) {
  const qc = useQueryClient();
  const openedIds = useOpenedChatsStore((s) => s.openedIds);
  const { goToChat, closeChatFromSidebar } = useChatRouting();

  if (!openedIds.length) return null;

  return (
    <div className="flex flex-col gap-2">
      {openedIds.map((chatId) => {
        const chat = qc.getQueryData<Chat>(chatKeys.byId(chatId));
        const title = chat?.title ?? "Chat";

        return (
          <div
            key={chatId}
            className={`flex items-center gap-2 rounded-md p-2 ${
              props.currentChatId === chatId ? "bg-muted" : "hover:bg-muted"
            }`}
          >
            <button
              className="flex items-center gap-2 min-w-0 flex-1 text-left"
              onClick={() => goToChat(chatId)}
            >
              <Avatar
                imageUrl={chat?.avatarUrl}
                name={title}
                className="h-8 w-8"
              />
              <span className="truncate">{title}</span>
            </button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => closeChatFromSidebar(chatId, props.currentChatId)}
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
