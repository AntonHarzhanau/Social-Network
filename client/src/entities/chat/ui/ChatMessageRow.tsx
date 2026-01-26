import { cn } from "@/shared/lib/utils";
import type { Message } from "@/entities/chat/model/types";

export function ChatMessageRow(props: {
  message: Message;
  isMine: boolean;
  isUnread: boolean;
}) {
  const { message, isMine, isUnread } = props;

  return (
    <div
      className={cn(
        "w-full px-2 py-1",
        isMine ? "flex justify-end" : "flex justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-3 py-2 text-sm",
          isMine ? "bg-primary text-primary-foreground" : "bg-muted",
          isUnread && !isMine ? "ring-1 ring-primary/40" : "",
        )}
      >
        {!isMine && (
          <div className="text-xs opacity-70 mb-1">
            {message.sender.name}
            {isUnread ? " • unread" : ""}
          </div>
        )}
        <div className="whitespace-pre-wrap wrap-break-word">
          {message.content}
        </div>
      </div>
    </div>
  );
}
