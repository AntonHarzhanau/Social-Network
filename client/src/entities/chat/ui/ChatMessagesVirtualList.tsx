import { CardContent } from "@/shared/components/ui/card";
import type { Message } from "@/entities/chat/model/types";
import type { VirtualItem } from "@tanstack/react-virtual";

import { ChatMessageRow } from "./ChatMessageRow";

export function ChatMessagesVirtualList(props: {
  parentRef: React.RefObject<HTMLDivElement | null>;
  isFetching: boolean;

  totalSize: number;
  virtualItems: VirtualItem[];
  measureElement: (el: Element | null) => void;

  messages: Message[];
  unreadSet: Set<string>;
  currentUserId?: string;
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
  } = props;

  return (
    <CardContent className="flex-1 min-h-0 p-0 relative">
      <div ref={parentRef} className="h-full overflow-auto">
        {isFetching && (
          <div className="py-2 text-center text-xs text-muted-foreground">
            Loading…
          </div>
        )}

        <div
          style={{
            height: totalSize,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualItems.map((v) => {
            const msg = messages[v.index];
            if (!msg) return null;

            const isMine = !!currentUserId && msg.sender.id === currentUserId;
            const isUnread = unreadSet.has(msg.id);

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
                />
              </div>
            );
          })}
        </div>
      </div>
    </CardContent>
  );
}
