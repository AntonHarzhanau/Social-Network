import { useQueryClient } from "@tanstack/react-query";
import type { Chat, ChatMercureEvent } from "@/entities/chat/model/types";
import { chatQueryKeys } from "@/entities/chat/model/chatQueryKeys";
import { useMercure } from "@/shared/hooks/useMercure";
import { topics } from "@/shared/constants/topics";
import {
  appendMessageToCache,
  removeMessageFromCache,
  updateMessageInCache,
} from "@/entities/chat/lib/messageInfiniteCache";

function invalidateChatLists(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({
    predicate: (q) =>
      Array.isArray(q.queryKey) &&
      q.queryKey[0] === chatQueryKeys.all[0] &&
      q.queryKey[1] === "list",
  });
}

export function useChatMercure(params: {
  chatId: string;
  enable: boolean;
  currentUserId?: string;
  recomputeTail: () => boolean;
  scrollToBottom: () => void;
  scheduleSaveScroll: () => void;
  scheduleRead: (id?: string) => void;
  setIsAtTail: (v: boolean) => void;
  incNewCount: () => void;
}) {
  const qc = useQueryClient();

  useMercure<ChatMercureEvent>({
    topic: topics.chat(params.chatId),
    enable: params.enable,
    onMessage: (evt) => {
      console.log("Mercure event received in chat:", evt);
      switch (evt.type) {
        case "message_created": {
          invalidateChatLists(qc);

          const wasAtTail = params.recomputeTail();
          const isMine =
            !!params.currentUserId &&
            evt.message.sender.id === params.currentUserId;

          appendMessageToCache(qc, params.chatId, evt.message);

          if (isMine || wasAtTail) {
            requestAnimationFrame(() => {
              params.scrollToBottom();
              params.scheduleSaveScroll();
              if (!isMine) params.scheduleRead(evt.message.id);
            });
          } else {
            params.setIsAtTail(false);
            params.incNewCount();
            params.scheduleSaveScroll();
          }
          return;
        }

        case "message_updated":
          invalidateChatLists(qc);
          updateMessageInCache(qc, params.chatId, evt.messageId, evt.message);
          return;

        case "message_deleted":
          invalidateChatLists(qc);
          removeMessageFromCache(qc, params.chatId, evt.messageId);
          return;

        case "chat_read": {
          if (evt.userId === params.currentUserId) return;

          qc.setQueryData<Chat>(chatQueryKeys.byId(params.chatId), (prev) => {
            if (!prev) return prev;
            if (prev.type !== "direct") return prev;

            return {
              ...prev,
              lastReadAtByOther: evt.lastReadAt,
              lastReadMessageByOther: evt.lastReadMessageId,
            };
          });

          invalidateChatLists(qc);
          return;
        }

        default:
          invalidateChatLists(qc);
      }
    },
  });
}
