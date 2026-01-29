import type { NotificationHandler } from "./types";
import type { ChatMessageNotification } from "../../model/types";
import { getChatId } from "../../model/types";
import { chatQueryKeys } from "@/entities/chat/model/chatQueryKeys";

const getCurrentChatId = (pathname: string): string | null => {
  const m = pathname.match(/^\/chats\/([^\/?#]+)/);
  return m?.[1] ?? null;
};

export const chatMessageHandler: NotificationHandler<ChatMessageNotification> =
  {
    type: "chat_message",

    getLink: (n) => {
      const chatId = getChatId(n);
      return chatId ? `/chats/${chatId}` : null;
    },

    onReceive: (n, ev, ctx) => {
      ctx.qc.invalidateQueries({ queryKey: chatQueryKeys.unread() });
      ctx.qc.invalidateQueries({ queryKey: chatQueryKeys.all });

      const currentChatId = getCurrentChatId(ctx.location.pathname);
      const chatId = getChatId(n);

      if (currentChatId && chatId && currentChatId === chatId) {
        return { showToast: false, autoAck: true };
      }

      return { showToast: ev.action === "created" || ev.action === "updated" };
    },
  };
