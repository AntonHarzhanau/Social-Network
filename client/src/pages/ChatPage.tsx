import { useEffect } from "react";
import { useParams } from "react-router-dom";

import MainSectionLayout from "@/shared/components/MainSectionLayout";
import ChatList from "@/entities/chat/ui/ChatList";
import ChatRoomCard from "@/entities/chat/ui/ChatRoomCard";
import { OpenChatsSidebar } from "@/features/chat/openedChats/ui/OpenChatsSidebar";
import { useOpenedChatsStore } from "@/features/chat/openedChats/model/openedChatsStore";

const ChatPage = () => {
  const { chatId: urlChatId = "" } = useParams<{ chatId: string }>();

  const open = useOpenedChatsStore((s) => s.open);

  // для прямого входа по URL
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
      asideContent={<OpenChatsSidebar currentChatId={urlChatId} />}
    />
  );
};

export default ChatPage;
export const Component = ChatPage;
