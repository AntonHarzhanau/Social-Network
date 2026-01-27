import { useEffect } from "react";
import { useParams } from "react-router-dom";

import MainSectionLayout from "@/shared/components/MainSectionLayout";
import ChatList from "@/widgets/Chat/ChatList";
import ChatRoomCard from "@/widgets/Chat/ChatRoomCard";
import { useOpenedChatsStore } from "@/features/chat/openedChats/model/openedChatsStore";
import ChatWidgets from "@/widgets/Chat/ChatWidgets";

const ChatPage = () => {
  const { chatId: urlChatId = "" } = useParams<{ chatId: string }>();

  const open = useOpenedChatsStore((s) => s.open);

  useEffect(() => {
    if (urlChatId) open(urlChatId);
  }, [urlChatId, open]);

  return (
    <MainSectionLayout
      pageContent={
        <div className="min-w-0">
          {urlChatId ? (
            <ChatRoomCard key={urlChatId} chatId={urlChatId} />
          ) : (
            <ChatList />
          )}
        </div>
      }
      asideContent={<ChatWidgets currentChatId={urlChatId} />}
    />
  );
};

export default ChatPage;
export const Component = ChatPage;
