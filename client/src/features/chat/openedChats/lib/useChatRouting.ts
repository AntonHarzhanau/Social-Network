import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import type { Chat } from "@/entities/chat/model/types";
import { chatKeys } from "@/entities/chat/model/queryKeys";
import { useOpenedChatsStore } from "../model/openedChatsStore";

export function useChatRouting() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const openInStore = useOpenedChatsStore((s) => s.open);
  const closeInStore = useOpenedChatsStore((s) => s.close);

  /** открыть чат: добавить в store + перейти в URL */
  const openChat = (chatId: string) => {
    openInStore(chatId);
    navigate(`/chats/${chatId}`);
  };

  /** ✅ переключить чат: гарантировать state в store ДО navigate */
  const goToChat = (chatId: string) => {
    openInStore(chatId);
    navigate(`/chats/${chatId}`);
  };

  /** закрыть из sidebar */
  const closeChatFromSidebar = (
    chatId: string,
    currentChatId: string | null,
  ) => {
    closeInStore(chatId);

    qc.removeQueries({ queryKey: chatKeys.byId(chatId), exact: true });

    if (currentChatId === chatId) {
      navigate("/chats", { replace: true });
    }
  };

  /** закрыть просмотр */
  const closeView = () => {
    navigate("/chats", { replace: true });
  };

  /** положить в byId кеш */
  const putChatToByIdCache = (chat: Chat) => {
    qc.setQueryData(chatKeys.byId(chat.id), chat);
  };

  return {
    openChat,
    goToChat,
    closeChatFromSidebar,
    closeView,
    putChatToByIdCache,
  };
}
