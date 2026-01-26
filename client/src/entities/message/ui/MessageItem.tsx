import { Button } from "@/shared/components/ui/button";
import { Avatar } from "@/shared/components/Avatar";
import { cn } from "@/shared/lib/utils";
import type { Message } from "@/entities/chat/model/types";
import { useDeleteMessage } from "@/entities/message/model/useDeleteMessage";

interface MessageItemProps {
  chatId: string;
  message: Message;
  currentUserId?: string;

  isUnread: boolean;
  messageIndex: number;
}

const MessageItem = ({
  chatId,
  message,
  currentUserId,
  isUnread,
  messageIndex,
}: MessageItemProps) => {
  const del = useDeleteMessage();

  const isMine = message.sender.id === currentUserId;

  return (
    <div
      id={`msg-${message.id}`}
      data-message-id={message.id}
      data-message-index={messageIndex}
      className={cn("mb-2", isMine ? "ml-auto" : "mr-auto")}
    >
      <div
        className={cn(
          "flex items-center gap-2 p-1 rounded-2xl",
          // вместо "не мои" — подсветка непрочитанных
          isUnread && "bg-foreground/10",
        )}
      >
        <Avatar
          imageUrl={message.sender.avatarUrl}
          name={message.sender.name}
          className="w-8 h-8 min-w-8"
        />

        <div
          className={cn(
            "flex flex-col rounded-lg px-3 py-2",
            // обычный фон пузыря
            "bg-muted",
            // если непрочитанное — делаем пузырь темнее
            isUnread && "bg-foreground/15",
          )}
        >
          <h2 className="text-xs font-semibold">{message.sender.name}</h2>
          <p className="text-sm whitespace-pre-wrap wrap-break-words wrap-anywhere">
            {message.content}
          </p>
        </div>

        <Button
          onClick={() => del.mutate({ chatId, messageId: message.id })}
          variant="ghost"
          size="icon"
          className="opacity-50 hover:opacity-80 ml-auto"
          disabled={del.isPending}
        >
          &#x2715;
        </Button>
      </div>
    </div>
  );
};

export default MessageItem;
