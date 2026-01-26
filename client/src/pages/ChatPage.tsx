import { useEffect } from "react";
import { useParams } from "react-router-dom";

import MainSectionLayout from "@/shared/components/MainSectionLayout";
import { Spinner } from "@/shared/components/ui/spinner";

import ChatList from "@/widgets/Chat/ChatList";
import Chat from "@/widgets/Chat/Chat";
import ChatAside from "@/widgets/Chat/ChatAside";

import { useOpenChatsStore } from "@/entities/chat/model/openChatsStore";
import { useChatQuery } from "@/entities/chat/model/useChat";

const ChatPage = () => {
  const { chatId: urlChatId = "" } = useParams<{ chatId: string }>();

  const openChat = useOpenChatsStore((s) => s.openChat);
  const openChatIds = useOpenChatsStore((s) => s.openChatIds);

  const isAlreadyOpen = !!urlChatId && openChatIds.includes(urlChatId);

  // Для прямого захода по URL — проверяем, что чат существует
  const chatQuery = useChatQuery(urlChatId);

  useEffect(() => {
    if (!urlChatId) return;
    if (isAlreadyOpen) return;
    if (!chatQuery.data) return;

    openChat(urlChatId);
  }, [urlChatId, isAlreadyOpen, chatQuery.data, openChat]);

  if (urlChatId && !isAlreadyOpen) {
    if (chatQuery.isLoading) {
      return (
        <div className="flex items-center justify-center w-full min-h-screen">
          Loading chat <Spinner />
        </div>
      );
    }
    if (chatQuery.isError) return <div className="p-2">Chat not found.</div>;
  }

  return (
    <MainSectionLayout
      pageContent={
        <div className="flex flex-col flex-5 gap-2 min-w-0">
          {urlChatId ? <Chat chatId={urlChatId} /> : <ChatList />}
        </div>
      }
      asideContent={<ChatAside urlChatId={urlChatId} />}
    />
  );
};

export default ChatPage;
export const Component = ChatPage;
