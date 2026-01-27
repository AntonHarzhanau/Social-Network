import { Card } from "@/shared/components/ui/card";
import type { Chat } from "@/entities/chat/model/types";

import { ChatRoomHeader } from "../../entities/chat/ui/ChatRoomHeader";
import { ChatMessagesVirtualList } from "../../entities/chat/ui/ChatMessagesVirtualList";
import { ChatJumpControls } from "../../entities/chat/ui/ChatJumpControls";
import NewMessageForm from "../../entities/chat/ui/NewMessageForm";
import { useChatRoomController } from "@/features/chat/chatRoom/model/useChatRoomController";
import { MessageComposerProvider } from "../../entities/chat/model/messageComposerContext";

const PAGE_SIZE = 10;
const READ_DEBOUNCE_MS = 500;

export default function ChatRoomCard(props: { chatId: string }) {
  const c = useChatRoomController({
    chatId: props.chatId,
    pageSize: PAGE_SIZE,
    readDebounceMs: READ_DEBOUNCE_MS,
  });

  if (c.isLoading) return <div>Loading…</div>;
  if (c.isError) return <div>Error: {c.errorMessage}</div>;
  if (!c.chat) return <div>Chat not found</div>;

  return (
    <MessageComposerProvider>
      <Card className="relative h-[75vh] md:h-[80vh] lg:h-[90vh] flex flex-col">
        <ChatRoomHeader
          title={c.title}
          avatarUrl={c.chat.avatarUrl}
          onClose={c.closeView}
        />

        <ChatMessagesVirtualList
          parentRef={c.parentRef}
          isFetching={c.isFetching}
          totalSize={c.totalSize}
          virtualItems={c.virtualItems}
          measureElement={c.measureElement}
          messages={c.messages}
          unreadSet={c.unreadSet}
          currentUserId={c.currentUserId}
          chatType={c.chat.type}
          lastReadAtByOther={c.chat.lastReadAtByOther}
          lastReadMessageByOther={c.chat.lastReadMessageByOther}
        />

        <ChatJumpControls
          showNewBanner={c.showNewBanner}
          newCount={c.newCount}
          showJumpArrow={c.showJumpArrow}
          onJump={c.jumpToLatest}
        />

        <div className="shrink-0 border-t p-3">
          <NewMessageForm chatId={(c.chat as Chat).id} />
        </div>
      </Card>
    </MessageComposerProvider>
  );
}
