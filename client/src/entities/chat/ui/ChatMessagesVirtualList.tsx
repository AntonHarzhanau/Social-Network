import { CardContent } from "@/shared/components/ui/card";
import type { Chat, Message } from "@/entities/chat/model/types";
import type { VirtualItem } from "@tanstack/react-virtual";

import { ChatMessageRow } from "./ChatMessageRow";

function isReadByOtherCursor(
  msg: Message,
  cursorAt: string | null | undefined,
  cursorId: string | null | undefined,
) {
  if (!cursorAt && !cursorId) return false;

  // Основной критерий — по времени
  if (cursorAt) {
    const mt = new Date(msg.createdAt).getTime();
    const ct = new Date(cursorAt).getTime();

    if (mt < ct) return true;
    if (mt > ct) return false;

    // tie-break: одинаковая секунда/миллисекунда
    if (cursorId) return msg.id <= cursorId;
    return true;
  }

  // fallback только по id (работает корректно, если id монотонный по времени, как UUIDv7)
  if (cursorId) return msg.id <= cursorId;

  return false;
}

export function ChatMessagesVirtualList(props: {
  parentRef: React.RefObject<HTMLDivElement | null>;
  isFetching: boolean;

  totalSize: number;
  virtualItems: VirtualItem[];
  measureElement: (el: Element | null) => void;

  messages: Message[];
  unreadSet: Set<string>;
  currentUserId?: string;

  chatType: Chat["type"];
  lastReadAtByOther?: string | null;
  lastReadMessageByOther?: string | null;
}) {
  const {
    parentRef,
    isFetching,
    totalSize,
    virtualItems,
    measureElement,
    messages,
    unreadSet,
    currentUserId,
    chatType,
    lastReadAtByOther,
    lastReadMessageByOther,
  } = props;

  return (
    <CardContent className="flex-1 min-h-0 p-0 relative px-9">
      <div ref={parentRef} className="h-full overflow-auto">
        {isFetching && (
          <div className="py-2 text-center text-xs text-muted-foreground">
            Loading…
          </div>
        )}

        <div style={{ height: totalSize, width: "100%", position: "relative" }}>
          {virtualItems.map((v) => {
            const msg = messages[v.index];
            if (!msg) return null;

            const isMine = !!currentUserId && msg.sender.id === currentUserId;
            const isUnread = unreadSet.has(msg.id);
            const showReadMark = chatType === "direct" && isMine;

            const readByOther =
              showReadMark &&
              isReadByOtherCursor(
                msg,
                lastReadAtByOther,
                lastReadMessageByOther,
              );

            return (
              <div
                key={v.key}
                data-index={v.index}
                ref={measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${v.start}px)`,
                }}
              >
                <ChatMessageRow
                  message={msg}
                  isMine={isMine}
                  isUnread={isUnread}
                  showReadMark={showReadMark}
                  isReadByOther={!!readByOther}
                />
              </div>
            );
          })}
        </div>
      </div>
    </CardContent>
  );
}
