import ChatList from "@/widgets/Chat/ChatList";
import { useParams } from "react-router-dom";
import Chat from "@/widgets/Chat/Chat";
import { useOpenChatsStore } from "@/entities/chat/model/openChatsStore";
import { useChatQuery } from "@/entities/chat/model/useChat";
import ChatAside from "@/widgets/Chat/ChatAside";
import { Spinner } from "@/shared/components/ui/spinner";
import MainSectionLayout from "@/shared/components/MainSectionLayout";

const ChatPage = () => {
  const { chatId: urlChatId = "" } = useParams<{ chatId: string }>();
  const openChats = useOpenChatsStore((s) => s.openChats);
  const openChat = useOpenChatsStore((s) => s.openChat);

  const isAlreadyOpen =
    !!urlChatId && openChats.some((c) => c.id === urlChatId);
  const chatQuery = useChatQuery(urlChatId);

  if (urlChatId && !isAlreadyOpen && chatQuery.data) {
    openChat(chatQuery.data);
  }

  if (urlChatId && !isAlreadyOpen) {
    if (chatQuery.isLoading)
      return (
        <div className="flex items-center justify-center w-full min-h-screen">
          Loading chat <Spinner />
        </div>
      );
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
