import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import type { Chat } from "@/entities/chat/model/types";
import { chatQueryKeys } from "@/entities/chat/model/chatQueryKeys";
import { useOpenedChatsStore } from "../model/openedChatsStore";

export function useChatRouting() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const openInStore = useOpenedChatsStore((s) => s.open);
  const closeInStore = useOpenedChatsStore((s) => s.close);

  const openChat = (chatId: string) => {
    openInStore(chatId);
    navigate(`/chats/${chatId}`);
  };

  const goToChat = (chatId: string) => {
    openInStore(chatId);
    navigate(`/chats/${chatId}`);
  };

  const closeChatFromSidebar = (
    chatId: string,
    currentChatId: string | null,
  ) => {
    closeInStore(chatId);

    qc.removeQueries({ queryKey: chatQueryKeys.byId(chatId), exact: true });

    if (currentChatId === chatId) {
      navigate("/chats", { replace: true });
    }
  };

  const closeView = () => {
    navigate("/chats", { replace: true });
  };

  const putChatToByIdCache = (chat: Chat) => {
    qc.setQueryData(chatQueryKeys.byId(chat.id), chat);
  };

  return {
    openChat,
    goToChat,
    closeChatFromSidebar,
    closeView,
    putChatToByIdCache,
  };
}
