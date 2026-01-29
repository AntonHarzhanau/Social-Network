import { useEffect } from "react";
import { useParams } from "react-router-dom";

import MainSectionLayout from "@/shared/components/MainSectionLayout";
import ChatList from "@/widgets/Chat/ChatList";
import ChatRoomCard from "@/widgets/Chat/ChatRoomCard";
import ChatWidgets from "@/widgets/Chat/ChatWidgets";
import { useOpenedChatsStore } from "@/features/chat/openedChats/model/openedChatsStore";
import { useIsBelowLg } from "@/shared/hooks/useIsBelowLg";

const ChatPage = () => {
  const { chatId: urlChatId = "" } = useParams<{ chatId: string }>();

  const isBelowLg = useIsBelowLg();

  const open = useOpenedChatsStore((s) => s.open);
  const clear = useOpenedChatsStore((s) => s.clear);

  useEffect(() => {
    if (!isBelowLg) {
      if (urlChatId) open(urlChatId);
      return;
    }

    if (urlChatId) {
      clear();
      open(urlChatId);
    } else {
      clear();
    }
  }, [urlChatId, open, clear, isBelowLg]);

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
